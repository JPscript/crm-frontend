import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role } from '../app/model/role.model';
import { firstValueFrom, Observable } from 'rxjs';
import to, { headers } from './utils.service';
import { HttpResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'https://crm-backend-production-5a64.up.railway.app/roles'; 

  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }
}
