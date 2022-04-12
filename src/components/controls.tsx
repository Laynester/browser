import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../appContext";
import { ITab } from "../interfaces/ITab";

export default function Controls()
{
    const { selectedTab, tabs } = useAppContext();

    const [activeTab, setActiveTab] = useState<ITab>();

    useEffect(() =>
    {
        let tab: ITab = tabs.filter(tab => tab.id === selectedTab)[0];
        
        setActiveTab(tab);

        if (!tab) return;

        setActiveTab(tab)
        
    }, [tabs, selectedTab]);

    const canDo = useCallback((action: string) =>
    {
        if (!activeTab) return false;
        if (action === 'back') return activeTab.canGoBack;
        if (action === 'forward') return activeTab.canGoForward;
    }, [activeTab]);

    const doAction = (action: string) =>
    {
        if (!activeTab) return false;
        if (action === 'back') return activeTab.webview.goBack();
        if (action === 'forward') return activeTab.webview.goForward();
        return;
    }
    
    return <>
        <div className={`control-button ${canDo('back') ? `` : `disabled`}`} onClick={() => doAction('back')}>
            <i className="fa-solid fa-arrow-left"></i>
        </div>
        <div className={`control-button ${ canDo('forward') ? `` : `disabled`}`} onClick={()=> doAction('forward')}>
            <i className="fa-solid fa-arrow-right"></i>
        </div>
    </>
}