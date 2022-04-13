import { BrowserView, ipcRenderer, WebviewTag } from 'electron';
import Mousetrap from 'mousetrap';
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    WebViewHTMLAttributes,
} from 'react';
import { useAppContext } from '../app/appContext';
import { Tab } from '../utils';

interface WebviewProps {
    id: number;
    url: string;
}
export default function Webview(props: WebviewProps) 
{
    const { id = -1, url = null } = props;
    const ref = useRef<WebviewTag>();
    const { selectedTab, setTabs, setTab } = useAppContext();

    const updateSelf = useCallback((option: string, value: any) => 
    {
        setTabs((prevValue) => 
        {
            const newArray = [ ...prevValue ];

            newArray.forEach((tab) => 
            {
                if (tab.id === selectedTab) 
                {
                    if (option === 'routes') return tab.routes.push(value);
                    else tab[option] = value;
                }
            });

            return newArray;
        });
    },[ setTabs, selectedTab ]);

    const onDidNavigate = useCallback((e) => 
    {
        if (e.url === url) return;

        updateSelf('routes', e.url);
    }, [ updateSelf, url ]);

    const onPageUpdated = useCallback((event) => 
    {
        updateSelf('text', ref.current.getTitle());
    }, [ updateSelf, ref ]);

    const onNewWindow = useCallback((e, contents) => 
    {
        const { url, frameName, disposition, options } = e;
        e.preventDefault();
        if (disposition === 'foreground-tab') 
        {
            e.preventDefault();
            setTabs(prevValue =>
            {
                let newArray = [ ...prevValue ];

                let newint = newArray.length + 1;
                newArray.push(new Tab(newint, url, url))
                setTab(newint)
                return newArray;
            })
        }
        else if (disposition === 'background-tab') 
        {
            e.preventDefault();
            console.log('here or wtv 3');
            //this.window.viewManager.create({ url, active: false }, true);
        }

        //console.log(event)
        //if (event.url.includes('about:blank')) return;
        //ipcRenderer.send("app/newWindow", {url: event.url,width:event.options.width, height: event.options.height,title: event.options.title});
    },[ setTabs, setTab ])

    useEffect(() => 
    {
        let view: HTMLWebViewElement = ref.current;
        view.addEventListener('did-navigate', onDidNavigate.bind(this));
        view.addEventListener('did-navigate-in-page', onDidNavigate.bind(this));
        view.addEventListener('page-title-updated', onPageUpdated.bind(this));
        view.addEventListener('new-window', onNewWindow.bind(this));
        view.addEventListener('web-contents-created', onNewWindow.bind(this));
        view.setAttribute('plugins', '');
        view.setAttribute('allowpopups', '');
        view.setAttribute('webpreferences', 'nativeWindowOpen=true');

        setTabs((prevValue) => 
        {
            const newArray = [ ...prevValue ];

            newArray.forEach((tab) => 
            {
                if (tab.id === selectedTab) 
                {
                    tab.webview = ref.current;
                }
            });

            return newArray;
        });

        return () => 
        {
            view.removeEventListener('did-navigate', onDidNavigate.bind(this));
            view.removeEventListener(
                'did-navigate-in-page',
                onDidNavigate.bind(this)
            );
            view.removeEventListener(
                'page-title-updated',
                onPageUpdated.bind(this)
            );
            view.removeEventListener('new-window', onNewWindow.bind(this));
            view.removeEventListener(
                'web-contents-created',
                onNewWindow.bind(this)
            );
        };
    }, [ ref, onDidNavigate, onNewWindow, onPageUpdated, selectedTab, setTabs ]);

    return (
        <webview
            src={ url }
            ref={ ref }
            className={ `${ selectedTab === id ? 'active' : '' }` }
        />
    );
}
