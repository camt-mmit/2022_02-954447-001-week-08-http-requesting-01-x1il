import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, take } from 'rxjs';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'google-require-token',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './require-token.component.html',
  styleUrls: ['./require-token.component.scss']
})
export class RequireTokenComponent {
  protected readonly tokenReady$ : Observable<boolean | null>;
  constructor(private readonly tokenSerivce: TokenService){
    this.tokenReady$ = this.tokenSerivce.tokenRead$;
  }
  async onForceExpired(): Promise<void> {
    return this.tokenSerivce.forceExpired();
  }
  onLogin(): void{
    this.tokenSerivce
    .getAuthorizationURL()
    .pipe(take(1))
    .subscribe((url) => {
      console.debug(url);
      location.href = `${url}`;
    });
  }

}
