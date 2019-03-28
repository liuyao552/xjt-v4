import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpErrorHandler, HandleError } from '../../services/http-error-handler/http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private handleError: HandleError;
  deleteUrl: '/file/attachment/deleteByJson/';

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('HeroesService');
  }

  deleteImg (id): Observable<any> {
    if (!id) {
      return;
    }
    return this.http.get(this.deleteUrl + id)
    .pipe(
      catchError(this.handleError('getProjectList'))
    );
  }
}
