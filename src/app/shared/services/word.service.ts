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
	markWordAsUsed = new Subject();
	changeInLanguage = new Subject();
	wordsObs = new Subject();

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
		console.log('setSelected');
		console.log('word', word);
		console.log('idx', idx);
		this.selectedWord = word;
		this.selectedIdx = idx;
		this.backup = [];
	}

	getSelected(): string {
		return this.selectedWord;
	}

	getWholeSelected() {
		console.log('this.words', this.words, 'this.selectedIdx', this.selectedIdx, 'languageInUse', this.languageInUse);
		return this.words[this.languageInUse][this.selectedIdx];
	}

	markAsUsed(col: number, row: number) {
		this.markWordAsUsed.next({idx: this.selectedIdx, col: col, row: row});
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

  getHslColor(colorHue: string) {
    return 'hsla('+colorHue+', 100%, 50%, 0.8)';
	}

	getFontColor(colorCode: number) {
		if (colorCode > 360) {
			return this.getFontColor(colorCode-360);
		}
		return this.fontColors[colorCode];
	}

	setWords(allWords: WordModel[]) {
		this.words = allWords;
	}
	
	get getWords() {
		return this.words.slice();
	}

	set allWords(words: any) {
		this.words = words;
		this.wordsObs.next(this.words);
	}

	resetWords() {
		this.words.forEach((word)=>{
			word.dirty = false;
		});
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