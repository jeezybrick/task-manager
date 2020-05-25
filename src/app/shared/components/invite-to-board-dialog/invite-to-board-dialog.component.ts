import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { map, startWith } from 'rxjs/operators';

import { UserService } from '../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-invite-to-board-dialog',
  templateUrl: './invite-to-board-dialog.component.html',
  styleUrls: ['./invite-to-board-dialog.component.scss']
})
export class InviteToBoardDialogComponent implements OnInit, OnDestroy {
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];
  public users: User[] = [];
  public isUsersLoaded = false;
  private subs = new SubSink();

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.subs.sink = this.userService.getAllUsers().subscribe((users: User[]) => {
      this.users = users;
      this.isUsersLoaded = true;
    });

    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : [...this.users].map(user => user.fullname)));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.users.map(user => user.fullname).filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

}
