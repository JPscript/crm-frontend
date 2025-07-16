import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import ConstUrls from '../app/shared/constants/const-urls';
import to, { headers } from './utils.service';
import { AppUser } from '../app/model/appUser.model';
import { ModelMap } from '../app/model/modelMap.model';
import { isOkResponse, loadResponseData } from './utils.service';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private REGISTER_URL = ConstUrls.API_URL + '/appUser/registro';
  private LOGIN_URL = ConstUrls.API_URL + '/appUser/login';
  private LOGOUT_URL = ConstUrls.API_URL + '/appUser/logout';
  private ROLES_URL = ConstUrls.API_URL + '/roles';
  private CURRENT_APPUSER_URL = ConstUrls.API_URL + '/appUser/me';

  private currentUser: AppUser | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  async registerAppUser(userData: { name: string; email: string; password: string }) {
    const result = await to(firstValueFrom(
      this.http.post<any>(this.REGISTER_URL, userData, {
        headers,
        observe: 'response',
      })
    ));
    console.log('registerAppUser response:', result);
    return Array.isArray(result) ? [result[0], null] : [null, result];
  }

  async login(credentials: { email: string; password: string }) {
    const result = await to(
      this.http.post<HttpResponse<any>>(this.LOGIN_URL, credentials, {
        withCredentials: true,
        headers,
        observe: 'response',
      }).toPromise()
    );
    console.log('login response:', result);
    return Array.isArray(result) ? [result[0], null] : [null, result];
  }

  async getLoggedUser(): Promise<AppUser | null> {
    try {
      const response = await this.http.get<any>(this.CURRENT_APPUSER_URL, {
        withCredentials: true,
        observe: 'response'
      }).toPromise();
      console.log('getLoggedUser response:', response);
      if (response?.body?.type === 'OK') {
        return response.body.data as AppUser;
      } else {
        return null;
      }
    } catch (error) {
      console.log('getLoggedUser error:', error);
      return null;
    }
  }

  async logout() {
    try {
      const response = await this.http.post(this.LOGOUT_URL, {}, { withCredentials: true }).toPromise();
      console.log('logout response:', response);
      this.currentUser = null;
      this.router.navigate(['/login']);
    } catch (err) {
      console.log('logout error:', err);
      alert('Error al cerrar sesión. Por favor, inténtelo de nuevo más tarde.');
    }
  }

  getAllRoles(): Promise<[any, any]> {
    return to(this.http.get(this.ROLES_URL).toPromise().then((response) => {
      console.log('getAllRoles response:', response);
      return response;
    }));
  }

  getCurrentUser(): AppUser | null {
    return this.currentUser;
  }
}
