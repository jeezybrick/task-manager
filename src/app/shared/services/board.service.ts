import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Board } from '../../models/board.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private boards: Board[] = [];

  private boards$ = new BehaviorSubject<Board[]>(null);
  private activeBoard$ = new BehaviorSubject<Board>(null);

  constructor(private http: HttpClient) {
    this.getBoards().subscribe();
  }

  public getBoards(sortBy = 'createdAt', sortDirection = '1'): any {
    return this.http.get<Board[]>('/api/boards', {params: {sortBy, sortDirection}}).pipe(
      tap((boards: Board[]) => {
        this.boards = boards;
        this.boards$.next(this.boards);
      })
    );
  }

  public getBoardDetail(boardId): any {
    return this.http.get<Board>(`/api/boards/${boardId}`).pipe(
      tap((board: Board) => {
        this.activeBoard$.next(board);
      })
    );
  }

  public createBoard(data: { name: string; }): any {
    return this.http.post('/api/boards', data).pipe(
      tap((board: Board) => {
        this.boards.push(board);
        this.boards$.next(this.boards);
      })
    );
  }

  public deleteBoard(boardId): any {
    return this.http.delete(`/api/boards/${boardId}`).pipe(
      tap((data: any) => {
        const index = this.boards.findIndex((item) => item._id === boardId);

        if (index > -1) {
          this.boards.splice(index, 1);
        }
        this.boards$.next(this.boards);
      })
    );
  }

  public getActiveBoardsList(): any {
    return this.boards$.asObservable();
  }

  public setActiveBoardsList(data): void {
     this.boards$.next(data);
  }

  public getActiveBoard(): any {
    return this.activeBoard$.asObservable();
  }

}
