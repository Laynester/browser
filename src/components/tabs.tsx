import { useEffect } from "react";
import { useAppContext } from "../app/appContext"
import TabComponent from "./tabComponent";
import { Tab } from "../utils";

export default function Tabs()
{
    const { tabs, setTabs, setTab, setHistory } = useAppContext();

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

                    newArray.push(new Tab(newId, 'internal://startpage', 'internal://startpage'));

                    setHistory(prevHistory =>
                    {
                        const newHistory = [...prevHistory];

                        newHistory.push(new Tab(newId, 'internal://startpage', 'internal://startpage'));

                        return newHistory;
                    })
            
                    setTab(newId);

                    return newArray
                });
            }
        });
    });

    if (tabs && tabs.length <= 1) return null;

    return <div className="tab-container">
        { tabs && tabs.length > 1 && tabs.map(tab => <TabComponent key={tab.id} { ...tab } />) }
    </div>
}