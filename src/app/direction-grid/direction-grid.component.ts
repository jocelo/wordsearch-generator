import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-direction-grid',
  templateUrl: './direction-grid.component.html',
  styleUrls: ['./direction-grid.component.css']
})
export class DirectionGridComponent implements OnInit {
  @Input() wordSelected: string;
  directions: object[];
  direction: string;

  constructor() { }

  ngOnInit() {
    this.direction = 'east';
    console.log('wird sekected us:', this.wordSelected);
  }

  chooseDirection(event: any) {
    if (event.target.nodeName === 'I') {
      this.direction = event.target.dataset.direction;
    }
  }
}
