import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserData } from '../services/user-data';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpErrorHandler, HandleError } from '../services/http-error-handler/http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class Tab5Service {
  projectId: string;
  private handleError: HandleError;
  userUrl = '/core/user/personalCenter';
  logoutUrl = '/logout';

  constructor(private http: HttpClient, private userData: UserData, httpErrorHandler: HttpErrorHandler) {
    this.projectId = this.userData.getProjectId();
    this.handleError = httpErrorHandler.createHandleError('Tab4Service');
  }

  // getMessages (): Observable<any> {
  //   const url = this.MessageUrl + '?projectId=' + this.projectId + '&typeArr=-1;2;3;4;-2;-3;-4;5;6;7;8;9;10';
  //   return this.http.get(url)
  //   .pipe(
  //     catchError(this.handleError('valiCaptcha'))
  //   );
  // }

  logout(): Observable<any> {
    return this.http.get(this.logoutUrl)
    .pipe(
      catchError(this.handleError('valiCaptcha'))
    );
  }

  getUser(): Observable<any> {
    return this.http.get(this.userUrl)
    .pipe(
      catchError(this.handleError('valiCaptcha'))
    );
  }
}
