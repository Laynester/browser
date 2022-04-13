import { WebviewTag } from 'electron';
import { ITab } from '../interfaces/ITab';

export class Tab implements ITab {
    public id: number;
    public url: string;
    public text: string;
    public canGoBack: boolean;
    public canGoForward: boolean;
    public webview: WebviewTag;
    public routes: string[];
    
    constructor(id: number, url: string, text: string, back: boolean = false, forward: boolean = false, webview: WebviewTag = null, routes: string[] = []) { 
        this.id = id;
        this.url = url;
        this.text = text;
        this.canGoBack = back;
        this.canGoForward = forward;
        this.webview = webview;
        this.routes = routes;

        if(!this.routes.length) this.routes.push(url);
    }
}
