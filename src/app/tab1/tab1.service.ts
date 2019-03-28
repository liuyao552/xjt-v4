import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserData } from '../services/user-data';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpErrorHandler, HandleError } from '../services/http-error-handler/http-error-handler.service';

export interface Permission {
  tag: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  projectId: string;
  private handleError: HandleError;
  api: any;
  projectUrl = '/project/base/pbBaseProject/gethr1/';
  waterGageOEMSUrl = '/project/base/pbBaseProject/getWaterGageOEMS/';
  projectListUrl = '/project/base/pbBaseProject/listjson?pageSize=150&page=1';
  navUrl = '/project/base/appNavBar/saveNavbar';
  photographUrl = '/core/user/judgePhotograph';

  constructor(private http: HttpClient, private userData: UserData, httpErrorHandler: HttpErrorHandler) {
    this.projectId = this.userData.getProjectId();
    this.handleError = httpErrorHandler.createHandleError('HeroesService');
    this.api = {
      fire: '/report/DiaryBook/judgeFireAlarm/',
      fireAlarm: '/report/fireeye/judgefireProject/'
    };
  }

  VerifyPermissions (funType): Observable<Permission> {
    if (!funType) {
      return;
    }
    const url = this.api[funType] + this.projectId;
    return this.http.get<Permission>(url)
    .pipe(
      catchError(this.handleError<Permission>('VerifyPermissions'))
    );
  }

  getProjectData (ptxt: string): Observable<any> {
    const url = this.projectUrl + ptxt;
    return this.http.get<Permission>(this.userData.getCloudUrl(url))
    .pipe(
      catchError(this.handleError('getProjectData'))
    );
  }

  getWaterGageOEMS (ptxt: string): Observable<any> {
    const url = this.waterGageOEMSUrl + ptxt;
    return this.http.get<Permission>(url)
    .pipe(
      catchError(this.handleError('getWaterGageOEMS'))
    );
  }

  getProjectList (): Observable<any> {
    return this.http.get(this.projectListUrl)
    .pipe(
      catchError(this.handleError('getProjectList'))
    );
  }

  getNavList (): Observable<any> {
    const options = this.projectId ?
   { params: new HttpParams().set('projectId', this.projectId) } : {};
    return this.http.get(this.navUrl, options)
    .pipe(
      catchError(this.handleError('getProjectList'))
    );
  }

  getPhotograph() {
    const options = this.projectId ?
   { params: new HttpParams().set('projectId', this.projectId) } : {};
    return this.http.get(this.photographUrl, options)
    .pipe(
      catchError(this.handleError('getProjectList'))
    );
  }
  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error.message);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     console.error(
  //       `Backend returned code ${error.status}, ` +
  //       `body was: ${error.error}`);
  //   }
  //   // return an observable with a user-facing error message
  //   return throwError(
  //     'Something bad happened; please try again later.');
  // }
}
