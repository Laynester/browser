import { ipcRenderer } from 'electron/renderer';
import { useCallback, useEffect } from 'react';
import { useAppContext } from '../app/appContext';
import { findInArray, Tab } from '../utils';
import TabComponent from './tabComponent';

export default function Tabs() {
    const { tabs, setTabs, setTab, selectedTab, setBrowserConfig } = useAppContext();

    const onNewTab = useCallback(() => {
        setTabs(prevValue => {
            const newArray = [ ...prevValue ];
    
            let newId = newArray.length + 1;
    
            newArray.push(new Tab(newId, 'internal://startpage', 'internal://startpage'));
    
            setBrowserConfig((config) => {
                config.pushHistory('internal://startpage');
                return config;
            });
            
            setTab(newId);
    
            return newArray;
        });
    },[ setTabs, setTab, setBrowserConfig ]);

    const onCloseTab = useCallback(() => {
        setTabs(prevValue => {
            let newArray = [ ...prevValue ];
    
            newArray = newArray.filter((res) => {
                return res.id !== selectedTab;
            });

            if (!newArray.length) return newArray;
                
            setTab(findInArray(newArray, selectedTab - 1).id);
    
            return newArray;
        });
    }, [ setTabs, selectedTab, setTab ]);

    useEffect(() => {
        ipcRenderer.addListener('app/openTab', onNewTab);
        ipcRenderer.addListener('app/closeTab', onCloseTab);
        
        return () => {
            ipcRenderer.removeListener('app/openTab', onNewTab);
            ipcRenderer.removeListener('app/closeTab', onCloseTab);
        };
    },[ onNewTab, onCloseTab ]);

    if (tabs && tabs.length <= 1) return null;

    return <div className="tab-container">
        { tabs && tabs.length > 1 && tabs.map(tab => <TabComponent key={ tab.id } { ...tab } />) }
    </div>;
}
