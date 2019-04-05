export class WordService {
	selectedWord: string;
	backup: object[] = [];
	words: object[] = [];
	colorHue: number = 0;
	fontColors: object;

	constructor() {
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
			360: 'white',
		};
		this.words.push({
      label: 'nanis',
      bgColor: this.getHslColor(this.colorHue),
      fontColor: this.getFontColor(this.colorHue),
			active: false,
			used: true
    });
    this.colorHue += 30;
    this.words.push({
      label: 'maia',
      bgColor: this.getHslColor(this.colorHue),
      fontColor: this.getFontColor(this.colorHue),
			active: false,
			used: true
    });
    this.colorHue += 30;
    this.words.push({
      label: 'paula',
      bgColor: this.getHslColor(this.colorHue),
      fontColor: this.getFontColor(this.colorHue),
			active: false,
			used: false
    });
    this.colorHue += 30;
	}

	addWord(newWord: string) {
		this.words.push({
      label: newWord,
      bgColor: this.getHslColor(this.colorHue),
      fontColor: this.getFontColor(this.colorHue),
			active: false,
			used: false
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

	getFontColor(colorCode: number) {
		if (colorCode > 360) {
			return this.getFontColor(colorCode-360);
		}
		return this.fontColors[colorCode];
	}
	
	getWords() {
		return this.words;
	}
}