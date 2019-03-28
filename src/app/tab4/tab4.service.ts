import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserData } from '../services/user-data';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpErrorHandler, HandleError } from '../services/http-error-handler/http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class Tab4Service {
  projectId: string;
  private handleError: HandleError;
  MessageUrl = '/messageCenter/message/countMessageByCategory';
  countUrl = '/messageCenter/message/countSumMessage';

  constructor(private http: HttpClient, private userData: UserData, httpErrorHandler: HttpErrorHandler) {
    this.projectId = this.userData.getProjectId();
    this.handleError = httpErrorHandler.createHandleError('Tab4Service');
  }

  getMessages (): Observable<any> {
    const url = this.MessageUrl + '?projectId=' + this.projectId + '&typeArr=-1;2;3;4;-2;-3;-4;5;6;7;8;9;10';
    return this.http.get(url)
    .pipe(
      catchError(this.handleError('valiCaptcha'))
    );
  }

  getMessagesCount(): Observable<any> {
    return this.http.get(this.countUrl)
    .pipe(
      catchError(this.handleError('valiCaptcha'))
    );
  }
}
