import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(err => {
      // Skip auth redirect for public endpoints (e.g. user registration)
      const isPublic = req.url.startsWith('/graphql/auth');
      // CORS error (status 0) or 401 means session expired — redirect to login
      if (!isPublic && (err.status === 0 || err.status === 401)) {
        window.location.href = '/oauth2/authorization/immobanking-auth';
      }
      return throwError(() => err);
    })
  );
};
