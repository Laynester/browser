import { BrowserView, WebviewTag } from "electron";
import { useCallback, useEffect, useMemo, useRef, WebViewHTMLAttributes } from "react";
import { useAppContext } from "../appContext";
import Tabs from "./tabs";

interface WebviewProps {
    id: number;
    url: string;
}
export default function Webview(props: WebviewProps) {
    const { id = -1, url = null } = props;
    const ref = useRef<WebviewTag>();
    const { selectedTab, setTabs } = useAppContext();

    const onDidNavigate = (e) =>
    {
        if (e.url === url) return;

        console.log('hre')

        setTabs((prevValue) => {
            const newArray = [...prevValue];

            newArray.forEach((tab) => {
                if (tab.id === selectedTab)
                {
                    tab.routes.push(e.url);
                    tab.canGoBack = ref.current.canGoBack();
                    tab.canGoForward = ref.current.canGoForward();
                }
            });

            return newArray;
        });
    };

    const onPageUpdated = useCallback((event) =>
    {
        setTabs((prevValue) => {
            const newArray = [...prevValue];

            newArray.forEach((tab) => {
                if (tab.id === selectedTab)
                {
                    //console.log(view.webContents.getTitle())
                    tab.text = ref.current.getTitle();
                    
                }
            });

            return newArray;
        });
    }, []);

    useEffect(() =>
    {
        let view: HTMLWebViewElement = ref.current;
        view.addEventListener("did-navigate", onDidNavigate);
        view.addEventListener("did-navigate-in-page", onDidNavigate);
        view.addEventListener("page-title-updated", onPageUpdated);
        view.setAttribute("plugins", "");
        view.setAttribute("enableremotemodule", "true");

        setTabs((prevValue) => {
            const newArray = [...prevValue];

            newArray.forEach((tab) => {
                if (tab.id === selectedTab)
                {
                    tab.webview = ref.current;
                    
                }
            });

            return newArray;
        });

        return () => {
            view.removeEventListener("did-navigate", onDidNavigate);
            view.removeEventListener("did-navigate-in-page", onDidNavigate);
            view.removeEventListener("page-title-updated", onPageUpdated);
          };
    },[]);

    const jsCode = 'window.ReactNativeWebView.postMessage(document.documentElement.innerHTML)'


    return (
        <webview
            src={url}
            ref={ref}
            className={`${selectedTab === id ? `active` : ``}`} />
    );
}
