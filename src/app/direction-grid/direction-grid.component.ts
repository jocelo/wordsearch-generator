import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-direction-grid',
  templateUrl: './direction-grid.component.html',
  styleUrls: ['./direction-grid.component.css']
})
export class DirectionGridComponent implements OnInit {
  directions: object[];
  direction: string;

  constructor() { }

  ngOnInit() {
    this.direction = 'east';
  }

  chooseDirection(event) {
    if (event.target.nodeName === 'I') {
      this.direction = event.target.dataset.direction;
    }
  }
}
