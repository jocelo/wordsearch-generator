export class WordService {
	selectedWord: string;
	backup: object[] = [];
	words: object[] = [];
	colorHue: number = 0;

	constructor() {
		this.words.push({
      label: 'nanis',
      bgColor: this.getHslColor(this.colorHue),
      fontColor: 'black',
      active: false
    });
    this.colorHue += 30;
    this.words.push({
      label: 'maia',
      bgColor: this.getHslColor(this.colorHue),
      fontColor: 'black',
      active: false
    });
    this.colorHue += 30;
    this.words.push({
      label: 'paula',
      bgColor: this.getHslColor(this.colorHue),
      fontColor: 'black',
      active: false
    });
    this.colorHue += 30;
	}

	addWord(newWord: string) {
		this.words.push({
      label: newWord + this.colorHue,
      bgColor: this.getHslColor(this.colorHue),
      fontColor: this.colorHue > 200 ? 'white' : 'black',
      active: false
    });
    this.colorHue += 30;
	}

	setSelected(word: string): void {
		this.selectedWord = word;
		this.backup = [];
	}

	getSelected(): string {
		return this.selectedWord;
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
    return 'hsl('+colorHue+', 100%, 50%)';
	}
	
	getWords() {
		return this.words;
	}
}