import { Component, OnInit } from '@angular/core';
import {
  SignInWithApple,
  AppleSignInResponse,
  AppleSignInErrorResponse,
  ASAuthorizationAppleIDRequest
} from '@awesome-cordova-plugins/sign-in-with-apple/ngx';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  public loginWithApple = true;

  constructor(private signInWithApple: SignInWithApple,
              private platform: Platform) { }

  ngOnInit() {
    // this.loginWithApple = this.platform.is('ios');
  }

  login() {
    this.signInWithApple.signin({
      requestedScopes: [
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
      ]
    })
    .then((res: AppleSignInResponse) => {
      // https://developer.apple.com/documentation/signinwithapplerestapi/verifying_a_user
      alert('Send token to apple for verification: ' + res.identityToken);
      console.log(res);
    })
    .catch((error: AppleSignInErrorResponse) => {
      alert(error.code + ' ' + error.localizedDescription);
      console.error(error);
    });
  }

}
