import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname.includes('.asar') ? process.resourcesPath : __dirname, '../../resources/browser.json');
export class BrowserConfig {
    public preferences = {
        windowColor: '#0062ff'
    };
    private history: string[] = [];
    private bookmarks: string[] = [];
    
    constructor() {
        this.load();
    }

    private load() {
        try {
            let data: BrowserConfig = require('../../resources/browser.json');
            this.preferences = data.preferences;
            this.history = data.history;
            this.bookmarks = data.bookmarks;

            console.log(data);
        } catch(e) {
            const defaultJSON = this;
            fs.writeFileSync(filePath, JSON.stringify(defaultJSON), 'utf-8'); 
            this.load();
        }
    }

    public pushHistory(newHistory: string): void {
        this.history.push(newHistory);
        console.log(newHistory);
        this.saveFile();
    }

    public pushBookmark(newMark: string): void {
        this.bookmarks.push(newMark);
        this.saveFile();
    }

    private saveFile() {
        fs.writeFileSync(filePath, JSON.stringify(this), 'utf-8'); 
    }
}
