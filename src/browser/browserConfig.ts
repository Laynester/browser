import fs from 'fs';
import path from 'path';

export class BrowserConfig
{
    constructor()
    {
        this.load();
    }

    private load()
    {
        try 
        {
            let data = require('../../resources/browser.json');
            console.log(data); 
        }
        catch(e)
        {
            const filePath = path.join(__dirname.includes('.asar') ? process.resourcesPath : __dirname, '../../resources/browser.json')
            const defaultJSON = { 'preferences': {}, 'history': [], 'bookmarks': [] };
            fs.writeFileSync(filePath, JSON.stringify(defaultJSON), 'utf-8'); 
        }

    }
}
