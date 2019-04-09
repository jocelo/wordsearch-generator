import { WordModel } from "../models/word.model";
import { ɵConsole, Injectable } from "@angular/core";
import { NotificationsService } from "./notifications.service";

@Injectable()
export class WordService {
	selectedWord: string;
	selectedIdx: number;
	backup: object[] = [];
	words: WordModel[] = [];
	colorHue: number = 0;
	fontColors: object;
	grid: string[][];

	constructor(private notificationSrv: NotificationsService) {
		this.fontColors = {
			0: 'white',
			30: 'white',
			60: 'black',
			90: 'black',
			120: 'black',
			150: 'black',
			180: 'black',
			210: 'white',
			240: 'white',
			270: 'white',
			300: 'white',
			330: 'white',
			360: 'white'
		};
		this.words.push(new WordModel(
      'nanis',
      this.getHslColor(this.colorHue),
      this.getFontColor(this.colorHue),
			false,
			false, 
			false
		));
		this.colorHue += 30;
		/*
    this.words.push(new WordModel(
      'maia',
      this.getHslColor(this.colorHue),
      this.getFontColor(this.colorHue),
			false,
			false,
			false
    ));
    this.colorHue += 30;
    this.words.push(new WordModel(
      'paula',
      this.getHslColor(this.colorHue),
      this.getFontColor(this.colorHue),
			false,
			false,
			false
    ));
		this.colorHue += 30;
		*/
	}

	addWord(newWord: string) {
		this.words.push(new WordModel(
      newWord,
      this.getHslColor(this.colorHue),
      this.getFontColor(this.colorHue),
			false,
			false,
			false
		));
    this.colorHue += 30;
	}

	setSelected(word: string, idx: number): void {
		this.selectedWord = word;
		this.selectedIdx = idx;
		this.backup = [];
	}

	getSelected(): string {
		return this.selectedWord;
	}

	getWholeSelected() {
		return this.words[this.selectedIdx];
	}

	markAsUsed() {
		this.words[this.selectedIdx]['used'] = true;
	}

	savePreviousState(row:number, col:number, label:string) {
		this.backup.push({
			row:row,
			col:col,
			label:label
		});
	}

	getPreviousState() {
		const backups = this.backup.slice();
		this.backup = [];
		return backups;
	}

  getHslColor(colorHue: number) {
    return 'hsla('+colorHue+', 100%, 50%, 0.8)';
	}

	getFontColor(colorCode: number) {
		if (colorCode > 360) {
			return this.getFontColor(colorCode-360);
		}
		return this.fontColors[colorCode];
	}
	
	getWords() {
		return this.words;
	}

	generateStructure() {
		let allData = this.grid.map((row,index)=>{
			let caca = row.map(col=>{
				return col['label'];
			}).join('')
			return caca;
		});

		const game = {
			words: this.words.map(word=>word.label),
			game: allData
		};

		return game;
	}

	setGrid(grid: any){
		this.grid = grid;
	}

	allWordsUsed() {
		return this.words.filter(item=>!item.used).length === 0;
	}
}