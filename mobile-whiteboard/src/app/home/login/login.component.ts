import { Component, OnInit } from '@angular/core';
import {
  SignInWithApple,
  AppleSignInResponse,
  AppleSignInErrorResponse,
  ASAuthorizationAppleIDRequest
} from '@awesome-cordova-plugins/sign-in-with-apple/ngx';
import { Platform } from '@ionic/angular';
import { FileserverService } from 'src/app/fileserver/fileserver.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  public loginWithApple = true;

  constructor(private signInWithApple: SignInWithApple,
              private platform: Platform,
              private fsSrv: FileserverService) { }

  ngOnInit() {
    this.loginWithApple = this.platform.is('ios');
  }

  login() {
    // TODO: add loading
    this.signInWithApple.signin({
      requestedScopes: [
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
      ]
    })
    .then((res: AppleSignInResponse) => {
      // https://developer.apple.com/documentation/signinwithapplerestapi/verifying_a_user
      // alert('Send token to apple for verification: ' + res.identityToken);
      this.fsSrv.doLogin(res).subscribe(r => {
        this.fsSrv.setSession(r.token);
        window.location.reload(); // FIXME
      }, e => {
        alert('Error, Try again later.');
        console.error(e);
      });
      // console.log(res);
    })
    .catch((error: AppleSignInErrorResponse) => {
      alert('Error: ' + error.code);
      console.error(error);
    });
  }

}
