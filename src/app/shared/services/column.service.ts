import { Injectable } from '@angular/core';
import { of } from 'rxjs/index';
import { HttpClient } from '@angular/common/http';
import { Column } from '../../models/column.model';

@Injectable({
  providedIn: 'root'
})
export class ColumnService {

  constructor(private http: HttpClient) {}


  public getColumns(): any {
    return this.http.get<Column[]>(`/api/columns`);
  }

  public createColumn(boardId: string, data: any): any {
    return this.http.post(`/api/boards/${boardId}/columns`, data);
  }

  public deleteColumn(columnId): any {
    return this.http.delete(`/api/columns/${columnId}`);
  }

}
