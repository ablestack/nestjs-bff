import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { debug } from 'util';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http
      .post<any>('/backend/auth/public/local/signin', {
        username: username.trim(),
        password: password.trim(),
      })
      .pipe(
        map((res: any) => {
          // login successful if there's a jwt token in the response
          if (res && res.token) {
            // store username and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem(
              'currentUser',
              JSON.stringify({ username, token: res.token }),
            );
          }
        }),
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}
