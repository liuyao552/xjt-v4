import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserData } from '../../services/user-data';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpErrorHandler, HandleError } from '../../services/http-error-handler/http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class DragService {
  projectId: string;
  private handleError: HandleError;
  navUrl: '/project/base/appNavBar/saveNavbar';

  constructor(private http: HttpClient, private userData: UserData, httpErrorHandler: HttpErrorHandler) {
    this.projectId = this.userData.getProjectId();
    this.handleError = httpErrorHandler.createHandleError('HeroesService');
  }

  getNavList (typeArr?: string): Observable<any> {
    const params = new HttpParams();
    if (this.projectId) {
      params.append('projectId', this.projectId);
    }
    if (typeArr) {
      params.append('typeArr', typeArr);
    }
    const options = { params: params } || {};
    return this.http.get(this.navUrl, options)
    .pipe(
      catchError(this.handleError('getProjectList'))
    );
  }
}
