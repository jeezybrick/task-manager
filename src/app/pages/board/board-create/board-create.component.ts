import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../../shared/services/board.service';
import { Board } from '../../../models/board.model';

@Component({
  selector: 'app-board-create',
  templateUrl: './board-create.component.html',
  styleUrls: ['./board-create.component.scss']
})
export class BoardCreateComponent implements OnInit {

  public boardName = '';
  public isBoardCreateProcess = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private boardService: BoardService) {
  }

  ngOnInit() {
  }


  // создание доски
  public createBoard(): void {
    this.isBoardCreateProcess = true;

    this.boardService.createBoard({name: this.boardName}).subscribe((response: Board) => {
      this.router.navigate(['boards', response._id]);
    }, (error) => {
      this.isBoardCreateProcess = false;
    });
  }

}
