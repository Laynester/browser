import { WebviewTag } from 'electron';
import
{
    useCallback,
    useEffect, useRef
} from 'react';
import { useAppContext } from '../app/appContext';
import { Tab } from '../utils';
import StartPage from './internal/startPage';

interface WebviewProps {
    id: number;
    url: string;
}
export default function Webview(props: WebviewProps) {
    const { id = -1, url = null } = props;
    const ref = useRef<WebviewTag>();
    const { selectedTab, setTabs, setTab, setBrowserConfig } = useAppContext();

    const updateSelf = useCallback((option: string, value: any) => {
        setTabs((prevValue) => {
            const newArray = [ ...prevValue ];

            newArray.forEach((tab) => {
                if (tab.id === selectedTab) {
                    if (option === 'routes') return tab.routes.push(value);
                    else tab[option] = value;
                }
            });

            return newArray;
        });
    },[ setTabs, selectedTab ]);

    const onDidNavigate = useCallback((e) => {
        if (e.url === url) return;

        updateSelf('routes', e.url);
        updateSelf('canGoBack', ref.current.canGoBack());
        updateSelf('canGoForward', ref.current.canGoForward());

        setBrowserConfig((config) => {
            config.pushHistory(e.url);
            return config;
        });
        
    }, [ updateSelf, url, setBrowserConfig ]);

    const onPageUpdated = useCallback((event) => {
        updateSelf('text', ref.current.getTitle());
    }, [ updateSelf, ref ]);

    const onNewWindow = useCallback((e, contents) => {
        const { url, frameName, disposition, options } = e;
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
        if (url.includes('internal://')) return;

        let view: HTMLWebViewElement = ref.current;
        view.addEventListener('did-navigate', onDidNavigate.bind(this));
        view.addEventListener('did-navigate-in-page', onDidNavigate.bind(this));
        view.addEventListener('page-title-updated', onPageUpdated.bind(this));
        view.addEventListener('new-window', onNewWindow.bind(this));
        view.addEventListener('web-contents-created', onNewWindow.bind(this));
        view.setAttribute('plugins', '');
        view.setAttribute('allowpopups', '');
        view.setAttribute('webpreferences', 'nativeWindowOpen=true');

        setTabs((prevValue) => {
            const newArray = [ ...prevValue ];

            newArray.forEach((tab) => {
                if (tab.id === selectedTab) {
                    tab.webview = ref.current;
                }
            });

            return newArray;
        });

        return () => {
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
    }, [ ref, onDidNavigate, onNewWindow, onPageUpdated, selectedTab, setTabs, url ]);
    
    if (url.includes('internal://')) {
        console.log(url.split('internal://'));
        switch (url.split('internal://')[1]) { 
            case 'startpage':
                return <StartPage/>;
        }
    }

    return (
        <webview
            src={ url }
            ref={ ref }
            className={ `${ selectedTab === id ? 'active' : '' }` }
        />
    );
}
