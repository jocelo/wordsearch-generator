import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit {
  words: object[] = [];
  @ViewChild('newWord') newWord: string;
  colorHue: number = 0;

  constructor() { }

  ngOnInit() {
    /*
    this.words.push({
      label: 'nanis',
      color: this.colorHue,
      active: false
    });
    this.colorHue += 30;
    this.words.push({
      label: 'maia',
      color: this.colorHue,
      active: false
    });
    this.colorHue += 30;
    this.words.push({
      label: 'paula',
      color: this.colorHue,
      active: false
    });
    this.colorHue += 30;
    */
  }

  addWord() {
    console.log('adding new word:', this.newWord);

    // this.words.push('nanis');
    //this.colorHue = 0;
  }

  getHslColor() {
    
    return 'hsl('+this.colorHue+', 100%, 50%)';
  }

  selectWord(whatIsThis: any) {
    console.log('console', whatIsThis);
  }

}
