import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  public $headerState: Subject<any> = new Subject();

  constructor() { }

  public getHeaderState(): Observable<any> {
    return this.$headerState.asObservable();
  }

  public setHeaderState(state): void {
    this.$headerState.next(state);
  }

}
