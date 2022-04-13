import { ipcRenderer } from 'electron/renderer';
import { useCallback, useEffect } from 'react';
import { useAppContext } from '../app/appContext';
import { findInArray, Tab } from '../utils';
import TabComponent from './tabComponent';

export default function Tabs()
{
    const { tabs, setTabs, setTab, selectedTab } = useAppContext();

    const onNewTab = useCallback(() =>
    {
        setTabs(prevValue =>
        {
            const newArray = [ ...prevValue ];
    
            let newId = newArray.length + 1;
    
            newArray.push(new Tab(newId, 'internal://startpage', 'internal://startpage'));
    
            /* setHistory(prevHistory =>
            {
                const newHistory = [ ...prevHistory ];
    
                newHistory.push(new Tab(newId, 'internal://startpage', 'internal://startpage'));
    
                return newHistory;
            }) */
            
            setTab(newId);
    
            return newArray
        });
    },[ setTabs, setTab ])

    const onCloseTab = useCallback(() =>
    {
        setTabs(prevValue =>
        {
            let newArray = [ ...prevValue ];
    
            newArray = newArray.filter((res) =>
            {
                return res.id !== selectedTab
            })

            if (!newArray.length) return newArray;
                
            setTab(findInArray(newArray, selectedTab - 1).id)
            
            console.log(newArray)
    
            return newArray
        });
    }, [ setTabs, selectedTab, setTab ]);

    useEffect(() =>
    {
        ipcRenderer.addListener('app/openTab', onNewTab)
        ipcRenderer.on('app/closeTab', onCloseTab)
        return () =>
        {
            ipcRenderer.removeListener('app/openTab', onNewTab)
            ipcRenderer.removeListener('app/closeTab', onCloseTab)
        };
    },[ onNewTab, onCloseTab ]);

    if (tabs && tabs.length <= 1) return null;

    return <div className="tab-container">
        { tabs && tabs.length > 1 && tabs.map(tab => <TabComponent key={ tab.id } { ...tab } />) }
    </div>
}
