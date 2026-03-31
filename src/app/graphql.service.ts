import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GraphqlService {

  constructor(private http: HttpClient) {}

  query<T>(endpoint: string, query: string, variables: Record<string, unknown> = {}): Observable<T> {
    return this.http.post<{ data: T; errors?: any[] }>(`/graphql/${endpoint}`, { query, variables })
      .pipe(map(res => {
        if (res.errors?.length) {
          throw new Error(res.errors[0].message);
        }
        return res.data;
      }));
  }
}
