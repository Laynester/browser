import { createRoot } from 'react-dom/client';
import Tabs from '../components/tabs';
import TitleBar from '../components/titlebar';
import Webviews from '../components/webviews';
import App from './app';
import { AppContextProvider, useAppContext } from './appContext';

function render() {
    const root = createRoot(document.getElementById('root'));
    root.render(
        <AppContextProvider>
            <App/>
        </AppContextProvider>
    );
}

render();
