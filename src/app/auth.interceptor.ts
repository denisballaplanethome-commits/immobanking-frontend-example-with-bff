import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(err => {
      // CORS error (status 0) or 401 means session expired — redirect to login
      if (err.status === 0 || err.status === 401) {
        window.location.href = '/oauth2/authorization/immobanking-auth';
      }
      return throwError(() => err);
    })
  );
};
