import { WebviewTag } from 'electron';
import { ITab } from '../interfaces/ITab';


const { BrowserView } = require('electron').remote;
export class Tab implements ITab {
    public id: number;
    public url: string;
    public text: string;
    public canGoBack: boolean;
    public canGoForward: boolean;
    public browserView: typeof BrowserView;
    public routes: string[];
    
    constructor(id: number, url: string, text: string, back: boolean = false, forward: boolean = false, browserView: typeof BrowserView = null, routes: string[] = []) { 
        this.id = id;
        this.url = url;
        this.text = text;
        this.canGoBack = back;
        this.canGoForward = forward;
        this.browserView = browserView === null ? new BrowserView({ webPreferences: { plugins: true, nativeWindowOpen: true, allowPopups: true }
        }) : browserView;
        this.routes = routes;

        if(!this.routes.length) this.routes.push(url);
    }
}
