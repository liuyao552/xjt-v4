import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpErrorHandler, HandleError } from '../../services/http-error-handler/http-error-handler.service';
import { postOptions } from '../../services/headers';

@Injectable({
  providedIn: 'root'
})
export class ScanService {
  private handleError: HandleError;
  LabelInfoUrl = '/mt/mtMaterialLoc/getLabelInfoByCodeList/';
  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = httpErrorHandler.createHandleError('ScanService');
  }

  getQrcodeData(url): Observable<any> {
    if (!url) {
      return of({});
    }
    return this.http
      .get(url)
      .pipe(catchError(this.handleError('getQrcodeData')));
  }

  getLabelInfo(lableCode): Observable<any> {
    if (!lableCode) {
      return of({});
    }
    return this.http
      .get(this.LabelInfoUrl + lableCode)
      .pipe(catchError(this.handleError('getLabelInfo')));
  }

}
