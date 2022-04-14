/* @ts-ignore */
import { useAppContext } from '../app/appContext';
import Webview from './webview';

export default function Webviews() {
    const { tabs, setTabs, selectedTab } = useAppContext();

    
    return <div className="webview-container">
        { tabs && tabs.map(tab => <Webview key={ tab.id } { ...tab } />) }
    </div>;
}
