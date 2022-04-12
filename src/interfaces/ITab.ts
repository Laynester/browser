import { WebviewTag } from "electron";

export interface ITab
{
    id: number;
    url: string;
    text: string;
    canGoBack: boolean;
    canGoForward: boolean;
    webview: WebviewTag;
    routes: string[];
}