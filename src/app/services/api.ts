import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan } from '../interface/loan';

@Injectable({
  providedIn: 'root'
})
export class Api {

  private http = inject(HttpClient); // modern injection
  private baseUrl = 'https://your-api-url.com/api';

  getLoanStatus(loan: Loan): Observable<Loan> {
    return this.http.post<Loan>(`${this.baseUrl}/loan`, loan);
  }

}
