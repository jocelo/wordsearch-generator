import { WordModel } from "../models/word.model";
import { ɵConsole, Injectable } from "@angular/core";
import { NotificationsService } from "./notifications.service";
import { Subject } from "rxjs";

@Injectable()
export class WordService {
	selectedWord: string;
	selectedIdx: number;
	languageInUse: string;
	backup: object[] = [];
	words: WordModel[] = [];
	colorHue: number = 0;
	fontColors: object;
	gameGrid: string[][];
	markWordAsUsed = new Subject();
	changeInLanguage = new Subject();

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
		this.languageInUse = 'en';
	}

	addWords(newWords: WordModel[]) {
		this.words = newWords;
	}

	cleanWordList() {
		this.words = [];
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
		this.markWordAsUsed.next(this.selectedIdx);
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
		console.log('avout to tget the words::::', this.words);
		return this.words.slice();
	}

	generateStructure() {
		console.log('this grid', this.gameGrid);
		return;
		let allData = this.grid.map((row,index)=>{
			let caca = row.map(col=>{
				return col['label'];
			}).join('')
			return caca;
		});

		const game = {
			words: this.words.map(word=>word.en),
			game: allData
		};

		return game;
	}

	setGrid(grid: any){
		console.log('!!!! <> !!!!');
		this.gameGrid = grid;
	}

	allWordsUsed() {
		return this.words.filter(item=>!item.dirty).length === 0;
	}

	getLanguage() {
		return this.languageInUse;
	}

	setLanguage(lang: string) {
		this.languageInUse = lang;
		this.changeInLanguage.next(this.languageInUse);
	}
}