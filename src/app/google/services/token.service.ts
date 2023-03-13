import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap ,Observable,map,from, pipe, of, throwError, share, BehaviorSubject, debounceTime, distinctUntilChanged} from 'rxjs';
import { Configuration, ConfigurationToken, StorageToken ,TokenData, Storage, StateData, SecurityTokenNotFound, AccessTokenNotFound} from '../models';
import { arrayBufferToBase64, randomString, sha256 } from '../models/utils';

const oauthUrl = 'https://oauth2.googleapis.com/token';
const consentUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

const tokenKeyName = 'google-token';

const stateKeyPrefix = 'google-state-'
const verifierCodeLength = 56;
const securityTokenLength = 16;

const stateTTL = 10 * 60 * 1_000;

const networkLatency = 2 * (5 * 1_000);

type TokenDataloadingResult = {
  type: 'none';
} | {
  type: 'allowed';
  tokenData: TokenData;
} | {
  type: 'refresh';
  refreshToken: string;
};

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly storeTokenDataPipe = pipe(
    switchMap((tokenData:TokenData) => 
    from (this.storeTokenData(tokenData)))
  );
    private readonly tokenReadySubject = new BehaviorSubject<boolean | null>(null);

    readonly tokenRead$ = this.tokenReadySubject
      .asObservable()
      .pipe(debounceTime(100), distinctUntilChanged())
  constructor(
    @Inject(ConfigurationToken) private readonly configuration: Configuration, 
    @Inject(StorageToken) private readonly storage:Storage, 
  private readonly http:HttpClient,
  private readonly router:Router
  ){
    this.getAvailbleTokenData().then((result) => {
      console.debug(result);
      if(this.tokenReadySubject.value === null){
        this.tokenReadySubject.next(result.type !== 'none');
      }
    })
  }

  private async storeTokenData(tokenData:TokenData): Promise<TokenData>{
    //NOTE : set expiredAt and refresh_token
    const currentTime = Date.now();
    const storeTokenData = {...tokenData}
    const existingTokenData = await this.loadTokenData();

    if(!storeTokenData.refresh_token && existingTokenData?.refresh_token){
      storeTokenData.refresh_token = existingTokenData.refresh_token;
    }
    if(storeTokenData.expiredAt === undefined){
      storeTokenData.expiredAt =
        currentTime + (storeTokenData.expires_in  * 1000) - networkLatency;
    }
    await this.storage.storeData(tokenKeyName, storeTokenData);
    this.tokenReadySubject.next(true);
    return storeTokenData;
  }

  private async loadTokenData(): Promise<TokenData | null>{
    return this.storage.loadData(tokenKeyName);
  }

  private async removeTokenData(): Promise<void>{
    await this.storage.removeData(tokenKeyName);
    this.tokenReadySubject.next(false);
  }
  private async storeState(
    securityToken:string,
    stateData:StateData,
  ):Promise<StateData>{
    const currentTime = Date.now();
    const storedStateData = {...stateData};

    if(storedStateData.expiredAt === undefined){
      storedStateData.expiredAt = currentTime + stateTTL;
    }

    await this.storage.storeData(
      `${stateKeyPrefix}${securityToken}`,
      storedStateData
    )
    return storedStateData;
  }

  private async loadState(securityToken:string): Promise<StateData | null>{
    const currentTime = Date.now();

    for(const key of await this.storage.loadKeys()){
      console.debug(key);
      if(key.startsWith(stateKeyPrefix)){
        const data = await this.storage.loadData<StateData>(key);
        if((data?.expiredAt ?? 0) < currentTime){
          await this.storage.removeData(key)
        }
      }
    }
    console.debug(securityToken);
    return this.storage.loadData(`${stateKeyPrefix}${securityToken}`);
  }

  private async removestate(securityToken:string): Promise<StateData | null>{
    const existingTokenData = await this.loadState(securityToken);
    console.debug(existingTokenData);

    await this.storage.removeData(`${stateKeyPrefix}${securityToken}`);
    return existingTokenData
  }
  private refreshTokenData(refreshToken:string): Observable<TokenData>{
    return this.http
      .post<TokenData>(oauthUrl,{
      client_id: this.configuration.client_id,
      client_secret: this.configuration.client_secret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    })
    .pipe(this.storeTokenDataPipe)
  }

  exchangeCodeForToken(
    code:string,
    securityToken:string,
    errorMessage?:string,
  ):Observable<StateData>{
    return from(this.removestate(securityToken)).pipe(
      switchMap((stateData) => {
        if(errorMessage){
          return throwError(() => errorMessage);
        }
        return of(stateData);
      }),
      switchMap((stateData) => {
        if(stateData){
          return this.http.post<TokenData>(oauthUrl,{
            client_id: this.configuration.client_id,
            client_secret:  this.configuration.client_secret,
            code: code,
            code_verifier:stateData.verifierCode,
            grant_type: 'authorization_code',
            redirect_uri: this.configuration.redirect_uri,
          }).pipe(
            this.storeTokenDataPipe,
            map(() => stateData),
          );
        }
        return throwError(() => new SecurityTokenNotFound(securityToken));
      })
    );
  }

  getAuthorizationURL(): Observable<URL>{
    const verifierCode = randomString(verifierCodeLength)

    return from(sha256(verifierCode)).pipe(
    map((binary) => arrayBufferToBase64(binary, true)),
    switchMap((challengeCode) => {
      const securityToken = randomString(securityTokenLength);

      return from(this.storeState(securityToken,{
        verifierCode:verifierCode,
        redirectUrl: this.router.url,
      })).pipe(map(() => ({challengeCode,securityToken})));
    }),
    map(({challengeCode,securityToken}) => {
      const url = new URL(consentUrl);
      url.searchParams.set('client_id', this.configuration.client_id);
      url.searchParams.set('redirect_uri', this.configuration.redirect_uri);
      url.searchParams.set('response_type','code');
      url.searchParams.set('scope',this.configuration.scopes.join(' '));
      url.searchParams.set('code_challenge', challengeCode);
      url.searchParams.set('code_challenge_method', 'S256');
      url.searchParams.set(
        'state', 
        new URLSearchParams({
          security_token: securityToken,
      }).toString(),
      );

      url.searchParams.append('prompt','consent');
      url.searchParams.append('access_type','offline');
      return url;
    }),
    );
  }

    private async getAvailbleTokenData(): Promise<TokenDataloadingResult>{
      const tokenData = await this.loadTokenData();

      const currentTime = Date.now();

      if (tokenData){
        console.debug(tokenData, tokenData.expiredAt, tokenData.expiredAt ?? 0, (tokenData.expiredAt ?? 0) > currentTime);
        if((tokenData.expiredAt ?? 0) > currentTime){
          return {
            type: 'allowed',
            tokenData: tokenData,
          };
        } else if (tokenData.refresh_token){
          return {
            type: 'refresh',
            refreshToken: tokenData.refresh_token,
          };
        }
      }
       return { type: 'none'};   
      }
    private tryLoadingTokenData(): Observable<TokenData | null>{
      return from(this.getAvailbleTokenData()).pipe(
        switchMap((result) =>{
          if(result.type === 'none'){
            return of(null);
          } else if(result.type === 'allowed'){
            return of(result.tokenData);
          } else {
            return this.refreshTokenData(result.refreshToken);
          }
        }),
        share(),
        );
    }

    getAccessToken(): Observable<string | null>{
      return from(this.tryLoadingTokenData()).pipe(
        map((tokenData) => tokenData?.access_token ?? null),
      );
    }
    getAuthorizationHeader(): Observable<string>{
      return from(this.tryLoadingTokenData()).pipe(
        switchMap((tokenData) => {
          if(tokenData){
            return of(`${tokenData.token_type} ${ tokenData.access_token}`);
          }
          return throwError(() => new AccessTokenNotFound());

        }),
      )
    }
    async forceExpired(): Promise<void>{
      const existingTokenData = await this.loadTokenData();

      if(existingTokenData) {
        existingTokenData.expiredAt = 0;
      }
    }
      async deleteToken(): Promise<void> {
        return this.removeTokenData();
      }
    }

