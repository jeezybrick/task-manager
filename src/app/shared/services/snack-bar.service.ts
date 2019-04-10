import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor( private snackBar: MatSnackBar) { }

  public showSnackBar(message, actionsMessage = 'Отменить', config: any = {duration: 4000}): Observable<any> {

    const snackBarRef = this.snackBar.open(message, actionsMessage, config);
    return new Observable(observer => {
      snackBarRef.onAction().subscribe(() => {
        observer.next({'reverse': true});
        observer.complete();
      });

      snackBarRef.afterDismissed().subscribe(() => {
        observer.next({'dismissed': true});
        observer.complete();
      });
    });

  }
}
