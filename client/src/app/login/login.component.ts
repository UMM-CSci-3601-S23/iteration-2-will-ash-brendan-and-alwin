/* eslint-disable no-underscore-dangle */
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private clientId = environment.clientId;

  constructor(private fb: FormBuilder,
    private router: Router,
    private service: AuthService,
    private _ngZone: NgZone) { }

  ngOnInit(): void {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      //@ts-ignore
      google.accounts.id.initialize({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        auto_select: false,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        cancel_on_tap_outside: true
      });
      // instead of the callback, you can use a login_uri so it goes to an endpoint (you give it a url)... you can only do one OR the other
      // the author of this tutorial would hit the uri and have 0 clue what was needed to return so that the angular project could
      // capture the response
      //@ts-ignore
      google.accounts.id.renderButton(
        //@ts-ignore
        document.getElementById('buttonDiv'),
        { theme: 'outline', size: 'large', width: 300 }
      );
      //@ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    };
  }

  async handleCredentialResponse(response: CredentialResponse) {
    await this.service.loginWithGoogle(response.credential).subscribe({
      next: (cred: any) => {
        localStorage.setItem('token', cred.token);
        this._ngZone.runGuarded(() => {
          this.router.navigate(['/logout']); //you want this to go to wherever someone would go once they are logged in
        });
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

}
