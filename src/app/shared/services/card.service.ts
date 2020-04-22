import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  public updatePosition(data): any {
    return this.http.patch(`/api/cards/${data.cardId}/update-position`, data);
  }

  public deleteCard(cardId): any {
    return this.http.delete(`/api/cards/${cardId}`);
  }

   public updateCard(cardId, data): Observable<any> {
    return this.http.patch(`/api/cards/${cardId}`, data);
  }

}
