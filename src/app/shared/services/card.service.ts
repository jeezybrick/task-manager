import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) {}

  public getAllCards(): any {
    return this.http.get(`/api/cards`);
  }

  public createCard(columnId: string, data: any): any {
    return this.http.post(`/api/columns/${columnId}/cards`, data);
  }

  public deleteCard(cardId): any {
    return this.http.delete(`/api/cards/${cardId}`);
  }


}
