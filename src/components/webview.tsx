import { webContents, WebContents, WebviewTag } from 'electron';
import { ipcRenderer, remote } from 'electron/renderer';
import
{
    useCallback,
    useEffect, useRef, useState
} from 'react';
import { flushSync } from 'react-dom';
import { useAppContext } from '../app/appContext';
import { ITab } from '../interfaces/ITab';
import { Tab } from '../utils';
import StartPage from './internal/startPage';


const { BrowserView } = require('electron').remote;
interface WebviewProps extends ITab {
}
export default function Webview(props: WebviewProps) {
    const { id = -1, url = null, browserView } = props;
    const { selectedTab, setTabs, setTab, setBrowserConfig } = useAppContext();
  
    const updateSelf = useCallback((option: string, value: any) => {
        setTabs((prevValue) => {
            const newArray = [ ...prevValue ];

            newArray.forEach((tab) => {
                if (tab.id === selectedTab) {
                    if (option === 'routes') tab.routes.push(value);
                    else tab[option] = value;
                }
            });

            return newArray;
        });
    },[ setTabs, selectedTab ]);

    const onDidNavigate = useCallback((e,selfURL) => {
        if (selfURL === url) return;

        updateSelf('routes', selfURL);
        updateSelf('canGoBack', browserView.webContents.canGoBack());
        updateSelf('canGoForward', browserView.webContents.canGoForward());

        setBrowserConfig((config) => {
            config.pushHistory(selfURL);
            return config;
        });
        
    }, [ updateSelf, url, setBrowserConfig, browserView ]);

    const onPageUpdated = useCallback((event,title) => {
        updateSelf('text', title);
    }, [ updateSelf ]);

    const onNewWindow = useCallback((e, url, frameName, disposition, option) => {
        console.log(url,frameName,disposition);
        e.preventDefault();
        if (disposition === 'foreground-tab') {
            e.preventDefault();
            setTabs(prevValue => {
                let newArray = [ ...prevValue ];

                let newint = newArray.length + 1;
                newArray.push(new Tab(newint, url, url));
                setTab(newint);
                return newArray;
            });
        } else if (disposition === 'background-tab') {
            e.preventDefault();
            console.log('here or wtv 3');
            //this.window.viewManager.create({ url, active: false }, true);
        }
    }, [ setTabs, setTab ]);
    
    useEffect(() => {
        browserView.webContents.addListener('did-navigate', onDidNavigate);
        browserView.webContents.addListener('did-navigate-in-page', onDidNavigate);
        browserView.webContents.addListener('page-title-updated', onPageUpdated);
        browserView.webContents.addListener('new-window', onNewWindow);
        browserView.webContents.addListener('web-contents-created', onNewWindow);

        return () => {
            browserView.webContents.removeListener('did-navigate', onDidNavigate);
            browserView.webContents.removeListener('did-navigate-in-page', onDidNavigate);
            browserView.webContents.removeListener('page-title-updated', onPageUpdated);
            browserView.webContents.removeListener('new-window', onNewWindow);
            browserView.webContents.removeListener('web-contents-created', onNewWindow);

        };
    }, [ browserView, onDidNavigate, onPageUpdated, onNewWindow ]);
    
    useEffect(() => {
        if (url.includes('internal://')) return;

        let { offsetHeight } = document.getElementById('titlebar');

        let tempView = browserView;

        remote.getCurrentWindow().setBrowserView(tempView);

        if (url !== tempView.webContents.getURL()) tempView.webContents.loadURL(url);
        
        tempView.webContents.on('context-menu', () => {
            tempView.webContents.openDevTools(); 
        });
        tempView.setBounds({ x:0, y:offsetHeight, width:remote.getCurrentWindow().getContentBounds().width, height:remote.getCurrentWindow().getContentBounds().height - offsetHeight });

        let resize = new ResizeObserver(() => {
            let { offsetHeight } = document.getElementById('titlebar');
            tempView.setBounds({ x:0, y:offsetHeight, width:remote.getCurrentWindow().getContentBounds().width, height:remote.getCurrentWindow().getContentBounds().height - offsetHeight });

        });
        resize.observe(document.getElementById('root'));

        return () => {
            resize.disconnect();
        };
    }, [ url, browserView ]);
    
    useEffect(() => {
        if (selectedTab === id) {
            remote.getCurrentWindow().setBrowserView(browserView);
            let { offsetHeight } = document.getElementById('titlebar');
            browserView.setBounds({ x:0, y:offsetHeight, width:remote.getCurrentWindow().getContentBounds().width, height:remote.getCurrentWindow().getContentBounds().height - offsetHeight });
        }
    },[ selectedTab,id, browserView,url ]);
    
    if (url.includes('internal://')) {
        switch (url.split('internal://')[1]) { 
            case 'startpage':
                return <StartPage/>;
        }
    }


    return null;
}
