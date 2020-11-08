import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestAPIService {

  constructor(
    private http: HttpClient
  ) { }

  inference(text): Observable<any> {
    return this.http.post(
      '/api/inference',
      { text },
      this.getHttpOptions()
    )
  }

  protected getHttpOptions() {
    const headers: { [k: string]: string } = {};
    headers['Content-Type'] = 'application/json';

    return {
      headers: new HttpHeaders(headers),
    };
  }
}
