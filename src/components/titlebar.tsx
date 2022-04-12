import { ipcRenderer } from "electron/renderer";
import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useAppContext } from "../appContext";
import { ITab } from "../interfaces/ITab";
import { lastInArray } from "../utils";
import Controls from "./controls";

export default function TitleBar() {
    const [urlValue, setUrlValue] = useState<string>("");
    const { tabs, setTab, selectedTab, setTabs } = useAppContext();
    const [activeTab, setActiveTab] = useState<ITab>(null);

    const toggleSize = () => {
       ipcRenderer.send("electron-react-titlebar/maximumize/set", 0);
    };

    const purifyUrl = (url) => {
        if (/(\.\w+\/?|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,4})?)$/i.test(url)) {
            url = (!url.match(/^[a-zA-Z]+:\/\//)) ? 'http://' + url : url;
        } else {
            url = (!url.match(/^[a-zA-Z]+:\/\//)) ? 'https://www.google.com/search?q=' + url.replace(' ', '+') : url;
        }
        return url;
    }

    useEffect(() =>
    {
        let tab: ITab = tabs.filter(tab => tab.id === selectedTab)[0];
        
        setActiveTab(tab);

        if (!tab) return;

        console.log('updated tabs', tab.routes)

        if (lastInArray(tab.routes).startsWith('internal://')) return setUrlValue('')

        setUrlValue(lastInArray(tab.routes).replace(/^https?:\/\//, ''));
        
    },[tabs,activeTab, selectedTab, lastInArray])

    const handleKeyDown = (event) =>
    {
        if (event.key === "Enter")
        {
            let url: string = purifyUrl(urlValue);
            if (!url.startsWith("http"))
            {
                flushSync(() =>
                {
                    setUrlValue((prevValue) =>
                    {
                        return url;
                    });
                });
            }
                if (tabs.length == 0)
                {

                    setTabs((prevValue) => {
                        const newArray = [...prevValue];

                        let newUrl = {
                            id: tabs.length + 1,
                            url: url,
                            text: "yuh " + tabs.length + 1,
                            canGoBack: false,
                            canGoForward: false,
                            webview: null,
                            routes: [url]
                        };

                        newArray.push(newUrl);

                        setTab(tabs.length + 1);

                        return newArray;
                    });
                } else {
                    setTabs((prevValue) => {
                        const newArray = [...prevValue];

                        newArray.forEach((tab) => {
                            if (tab.id === selectedTab) {
                                tab.url = url;
                            }
                        });

                        return newArray;
                    });
                }
            } 
    }

    const focusBlur = useCallback((type: string) =>
    {
        if (!activeTab) return;

        if (lastInArray(activeTab.routes).startsWith('internal://')) return setUrlValue('');

        if (type == "blur") setUrlValue(lastInArray(activeTab.routes).replace(/^https?:\/\//, ''));
        else setUrlValue(lastInArray(activeTab.routes))
        
    }, [activeTab]);

    return (
        <div className="titlebar" onDoubleClick={toggleSize}>
            <div className="w-25 controls">
                <Controls />
            </div>
            <input
                type="text"
                className="urlBar"
                value={urlValue}
                onChange={(event) => setUrlValue(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search or enter website address"
                onBlur={ (event) => focusBlur('blur') }
                onFocus={ (event) => focusBlur('focus') }
            />
            <div className="w-25">{urlValue}</div>
        </div>
    );
}
