import { Injectable } from '@angular/core';
import { AppConfig } from '../config';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

/** Pass untouched request through to the next request handler. */
@Injectable({
    providedIn: 'root'
})
export class HostInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const secureReq = req.clone({
        url: AppConfig.server + req.url
      });
    return next.handle(secureReq);
  }
}

