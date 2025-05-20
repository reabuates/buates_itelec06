import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error.component';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {  
constructor(private dialog:MatDialog){}  


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage= "An Unknown Error Occurred!"  
        if(error.error.message){  
          errorMessage = error.error.message;  
        }  
        this.dialog.open(ErrorComponent, {data: {message: errorMessage}});  
        return throwError(() => error);
      })
    );
  }
}



