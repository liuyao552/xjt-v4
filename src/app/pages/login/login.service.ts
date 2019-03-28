import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpErrorHandler, HandleError } from '../../services/http-error-handler/http-error-handler.service';
import { postOptions } from '../../services/headers';
export interface Permission {
  tag: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private handleError: HandleError;
  loginUrl = '/login';
  loginoutUrl = '/logout';
  sendCaptchaUrl = '/register/sendCaptcha';
  valiCaptchaUrl = '/register/valiCaptcha';
  checkLoginNameUrl = '/register/checkLoginName';
  checkCompanyNameUrl = '/org/company/judgeCompanyName';
  registerUrl = '/register/registerm';
  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = httpErrorHandler.createHandleError('HeroesService');
  }

  login(user): Observable<any> {
    if (!user) {
      return of({});
    }
    return this.http
      .post(this.loginUrl, user, postOptions)
      .pipe(catchError(this.handleError('login')));
  }

  logout() {
    return this.http
      .get(this.loginoutUrl)
      .pipe(catchError(this.handleError('logout')));
  }

  sendCaptcha (phoneNumber): Observable<any> {
    if (!phoneNumber) {
      return of({});
    }
    const options = phoneNumber ?
    { params: new HttpParams().set('phoneNumber', phoneNumber) } : {};
    return this.http.get(this.sendCaptchaUrl, options)
    .pipe(
      catchError(this.handleError('sendCaptcha'))
    );
  }

  valiCaptcha (captcha, phoneNumber): Observable<any> {
    if (!phoneNumber || !captcha) {
      return of({});
    }
    const params = new HttpParams();
    params.append('captcha', captcha);
    params.append('phoneNumber', phoneNumber);
    const options = { params: params } || {};
    return this.http.get(this.valiCaptchaUrl, options)
    .pipe(
      catchError(this.handleError('valiCaptcha'))
    );
  }

  checkLoginName (loginName): Observable<any> {
    if (!loginName) {
      return of({});
    }
    const options = loginName ?
    { params: new HttpParams().set('loginName', loginName) } : {};
    return this.http.get(this.checkLoginNameUrl, options)
    .pipe(
      catchError(this.handleError('checkLoginName'))
    );
  }

  checkCompanyName (companyName): Observable<any> {
    if (!companyName) {
      return of({});
    }
    const options = companyName ?
    { params: new HttpParams().set('companyName', companyName) } : {};
    return this.http.get(this.checkCompanyNameUrl, options)
    .pipe(
      catchError(this.handleError('checkCompanyName'))
    );
  }

  register(user): Observable<any> {
    if (!user) {
      return of({});
    }
    return this.http
      .post(this.registerUrl, user, postOptions)
      .pipe(catchError(this.handleError('register')));
  }
}
