import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private path = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public signOutExternal = () => {
    localStorage.removeItem('token');
    console.log('Token Deleted--peace out!');
  };

  loginWithGoogle(credentials: string): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.httpClient.post(this.path + 'loginWithGoogle', JSON.stringify(credentials), { headers: header});
  }
}
