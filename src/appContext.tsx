import React, { createContext, Dispatch, FC, ProviderProps, SetStateAction, useContext, useState } from 'react';
import { ITab } from './interfaces/ITab';

interface IAppContext
{
    tabs: ITab[];
    setTabs: Dispatch<SetStateAction<ITab[]>>;
    selectedTab: number
    setTab: Dispatch<SetStateAction<number>>;
}

const AppContext = createContext<IAppContext>({
    tabs: [],
    setTabs:null,
    selectedTab: 0,
    setTab: null
});

export const AppContextProvider: FC<{children: React.ReactNode}> = (props) =>
{
    const [ tabs, setTabs ] = useState<ITab[]>([]);
    const [ selectedTab, setTab ] = useState<number>(0);

    return <AppContext.Provider value={ { tabs, setTabs, selectedTab, setTab } }>{ props.children }</AppContext.Provider>
};

export const useAppContext = () => useContext(AppContext);
