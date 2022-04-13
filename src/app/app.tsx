import Tabs from '../components/tabs';
import TitleBar from '../components/titlebar';
import Webviews from '../components/webviews';
import { hexToRgb, lightenDarkenColor, pSBC } from '../utils';
import { useAppContext } from './appContext';

export default function App() {
    const { browserConfig } = useAppContext();

    if (!browserConfig) return null;

    var style = {
        '--windowColor': browserConfig.preferences.windowColor,
        '--windowColorLighter': lightenDarkenColor(browserConfig.preferences.windowColor, 30),
        '--windowColorDarker': lightenDarkenColor(browserConfig.preferences.windowColor, -1)
    } as React.CSSProperties;
    
    return <div className="root" style={ style }>
        <TitleBar />
        <Tabs />
        <Webviews />
    </div>;
}
