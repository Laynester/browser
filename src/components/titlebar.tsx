import { ipcRenderer } from 'electron/renderer';
import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useAppContext } from '../app/appContext';
import { ITab } from '../interfaces/ITab';
import { lastInArray, Tab } from '../utils';
import Controls from './controls';

export default function TitleBar() 
{
    const [ urlValue, setUrlValue ] = useState<string>('');
    const { tabs, setTab, selectedTab, setTabs } = useAppContext();
    const [ activeTab, setActiveTab ] = useState<ITab>(null);

    const toggleSize = () => 
    {
        ipcRenderer.send('electron-react-titlebar/maximumize/set', 0);
    };

    const purifyUrl = (url) => 
    {
        if (/(\.\w+\/?|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,4})?)$/i.test(url)) 
        {
            url = (!url.match(/^[a-zA-Z]+:\/\//)) ? 'http://' + url : url;
        }
        else 
        {
            url = (!url.match(/^[a-zA-Z]+:\/\//)) ? 'https://www.google.com/search?q=' + url.replace(' ', '+') : url;
        }
        return url;
    }

    useEffect(() =>
    {
        let tab: ITab = tabs.filter(tab => tab.id === selectedTab)[0];
        
        setActiveTab(tab);

        if (!tab) return;

        if (lastInArray(tab.routes).startsWith('internal://')) return setUrlValue('')

        setUrlValue(lastInArray(tab.routes).replace(/^https?:\/\//, ''));
        
    }, [ tabs,activeTab, selectedTab ])

    const handleKeyDown = (event) =>
    {
        if (event.key === 'Enter')
        {
            let url: string = purifyUrl(urlValue);
            if (!url.startsWith('http'))
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

                setTabs((prevValue) => 
                {
                    const newArray = [ ...prevValue ];

                    let newUrl = new Tab(tabs.length + 1, url, url);

                    newArray.push(newUrl);

                    setTab(tabs.length + 1);

                    return newArray;
                });
            }
            else 
            {
                setTabs((prevValue) => 
                {
                    const newArray = [ ...prevValue ];

                    newArray.forEach((tab) => 
                    {
                        if (tab.id === selectedTab) 
                        {
                            tab.url = url;
                        }
                    });

                    return newArray;
                });
            }
            
            /* setHistory(prevHistory =>
            {
                const newHistory = [ ...prevHistory ];

                newHistory.push(new Tab(tabs.length + 1, url, url));

                return newHistory;
            }) */
        } 
    }

    const focusBlur = useCallback((type: string) =>
    {
        if (!activeTab) return;

        if (lastInArray(activeTab.routes).startsWith('internal://')) return setUrlValue('');

        if (type == 'blur') setUrlValue(lastInArray(activeTab.routes).replace(/^https?:\/\//, ''));
        else setUrlValue(lastInArray(activeTab.routes))
        
    }, [ activeTab ]);

    return (
        <div className="titlebar" onDoubleClick={ toggleSize }>
            <div className="w-25 controls">
                <Controls />
            </div>
            <div className="urlBar">
                <input
                    type="text"
                    className="urlBar-input"
                    value={ urlValue }
                    onChange={ (event) => setUrlValue(event.target.value) }
                    onKeyDown={ handleKeyDown }
                    placeholder="Search or enter website address"
                    onBlur={ (event) => focusBlur('blur') }
                    onFocus={ (event) => focusBlur('focus') }
                />
            </div>
            <div className="w-25">{ urlValue }</div>
        </div>
    );
}
