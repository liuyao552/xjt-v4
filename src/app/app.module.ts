import { LOCALE_ID, NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { httpInterceptorProviders } from './http-interceptors';
import { StoreModule } from '@ngrx/store';
import { ExceptionHandler } from './services/exception';
import { JPush } from '@jiguang-ionic/jpush/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
// import { PipesModule } from './pipes/pipes.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // blacklistedRoutes: ['localhost:4000/api/auth']
        whitelistedDomains: ['http://test2.xiaojiantong.com/xjt/logout']
      }
    }),
    IonicStorageModule.forRoot(),
    // StoreModule.forRoot(reducers, { metaReducers }),
    // PipesModule
  ],
  // exports: [PipesModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // {provide: ErrorHandler, useClass: ExceptionHandler},
    AuthService,
    AuthGuard,
    { provide: LOCALE_ID, useValue: 'zh-Hans-CN' },
    httpInterceptorProviders,
    JPush, Badge, QRScanner
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function tokenGetter() {
  return localStorage.getItem('access_token');
}
