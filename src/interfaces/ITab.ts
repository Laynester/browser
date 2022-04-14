const { BrowserView } = require('electron').remote;
export interface ITab
{
    id: number;
    url: string;
    text: string;
    canGoBack: boolean;
    canGoForward: boolean;
    browserView: typeof BrowserView
    routes: string[];
}
