import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan } from '../interface/loan';

@Injectable({
  providedIn: 'root'
})
export class Api {

  private baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getModel1Prediction(loan: Loan): Observable<any> {
    return this.http.post(`${this.baseUrl}/predict/model1`, loan);
  }

  getModel2Prediction(loan: Loan): Observable<any> {
    return this.http.post(`${this.baseUrl}/predict/model2`, loan);
  }

}
