import { useAppContext } from '../app/appContext';
import { ITab } from '../interfaces/ITab';


export default function Tab(props:ITab)
{
    const { id = -1, text = null, url = null } = props;

    const { selectedTab, setTab } = useAppContext();

    return <div className={ `tab ${ (selectedTab === id) ? 'active' : '' }` } onClick={ () => setTab(id) }>
        <img src={ 'http://www.google.com/s2/favicons?domain=' + url }/>
        <span className="tab-text">{ text }</span>
    </div>
}
