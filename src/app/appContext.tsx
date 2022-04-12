import React, { createContext, Dispatch, FC, ProviderProps, SetStateAction, useContext, useEffect, useState } from 'react';
import { loadHistory, saveHistory } from '../browser/history';
import { ITab } from '../interfaces/ITab';

interface IAppContext
{
    tabs: ITab[];
    setTabs: Dispatch<SetStateAction<ITab[]>>;
    selectedTab: number
    setTab: Dispatch<SetStateAction<number>>;
    history: ITab[];
    setHistory: Dispatch<SetStateAction<ITab[]>>;
}

const AppContext = createContext<IAppContext>({
    tabs: [],
    setTabs:null,
    selectedTab: 0,
    setTab: null,
    history: [],
    setHistory: null
});

export const AppContextProvider: FC<{children: React.ReactNode}> = (props) =>
{
    const [ tabs, setTabs ] = useState<ITab[]>([]);
    const [selectedTab, setTab] = useState<number>(0);
    
    const [history, setHistory] = useState<ITab[]>([]);
    
    useEffect(() =>
    {
        if (!history.length) return;
        saveHistory(history);
    }, [history])
    
    useEffect(() =>
    {
        setHistory(loadHistory());
    },[])

    return <AppContext.Provider value={ { tabs, setTabs, selectedTab, setTab, history, setHistory } }>{ props.children }</AppContext.Provider>
};

export const useAppContext = () => useContext(AppContext);
