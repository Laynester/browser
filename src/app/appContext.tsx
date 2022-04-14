import { remote } from 'electron/renderer';
import React, { createContext, Dispatch, FC, SetStateAction, useContext, useEffect, useState } from 'react';
import { BrowserConfig } from '../browser/browserConfig';
import { ITab } from '../interfaces/ITab';
import { Tab } from '../utils';

interface IAppContext
{
    tabs: ITab[];
    setTabs: Dispatch<SetStateAction<ITab[]>>;
    selectedTab: number
    setTab: Dispatch<SetStateAction<number>>;
    browserConfig: BrowserConfig;
    setBrowserConfig: Dispatch<SetStateAction<BrowserConfig>>;
}

const AppContext = createContext<IAppContext>({
    tabs: [ ],
    setTabs:null,
    selectedTab: 0,
    setTab: null,
    browserConfig: null,
    setBrowserConfig: null
});

export const AppContextProvider: FC<{ children: React.ReactNode }> = (props) => {
    const [ tabs, setTabs ] = useState<ITab[]>([ new Tab(0, 'internal://startpage', 'internal://startpage') ]);
    const [ selectedTab, setTab ] = useState<number>(0);
    
    const [ browserConfig, setBrowserConfig ] = useState<BrowserConfig>();
    
    useEffect(() => {
        setBrowserConfig(new BrowserConfig());
        remote.getCurrentWindow().getBrowserViews().forEach(view => remote.getCurrentWindow().removeBrowserView(view));
    },[]);

    return <AppContext.Provider value={ { tabs, setTabs, selectedTab, setTab, browserConfig, setBrowserConfig } }>{ props.children }</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
