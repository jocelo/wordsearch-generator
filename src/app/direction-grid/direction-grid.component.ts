import { Component, OnInit, Input } from '@angular/core';
import { ToolsService } from '../shared/services/tools.service';

@Component({
  selector: 'app-direction-grid',
  templateUrl: './direction-grid.component.html',
  styleUrls: ['./direction-grid.component.css']
})
export class DirectionGridComponent implements OnInit {
  @Input() wordSelected: string;
  directions: object[];
  direction: string;

  constructor(private toolSrv: ToolsService) { }

  ngOnInit() {
    this.direction = 'east';
  }

  chooseDirection(event: any) {
    if (event.target.nodeName === 'I') {
      this.direction = event.target.dataset.direction;
      this.toolSrv.setDirection(this.direction);
    }
  }
}
