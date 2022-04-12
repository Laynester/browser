import { useEffect } from "react";
import { useAppContext } from "../appContext"
import Tab from "./tab";

export default function Tabs()
{
    const { tabs, setTabs, setTab } = useAppContext();

    useEffect(() =>
    {
        window.addEventListener('keydown', function (evt)
        {
            evt.stopImmediatePropagation();
            if (evt.key === 't' && (evt.ctrlKey || evt.metaKey))
            {
                setTabs(prevValue =>
                {
                    const newArray = [...prevValue];

                    let newId = newArray.length + 1;
            
                    newArray.push({ id: newId, url: 'internal://startpage', text: 'yuh ' + newId, canGoBack: false, canGoForward: false, webview: null,routes:['internal://startpage'] });
                    setTab(newId);

                    return newArray
                });
            }
        });
    });

    if (tabs && tabs.length <= 1) return null;

    return <div className="tab-container">
        { tabs && tabs.length > 1 && tabs.map(tab => <Tab key={tab.id} { ...tab } />) }
    </div>
}