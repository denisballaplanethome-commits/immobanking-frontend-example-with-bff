import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GraphqlService {

  constructor(private http: HttpClient) {}

  query<T>(endpoint: string, query: string, variables: Record<string, unknown> = {}): Observable<T> {
    return this.http.post<{ data: T }>(`/graphql/${endpoint}`, { query, variables })
      .pipe(map(res => res.data));
  }
}
