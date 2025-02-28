// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import { JSX, useState } from 'react';
import { Provider } from 'react-redux';
import Welcome from './components/Welcome/Welcome';
import Playground from './components/Playground/Playground';
import Overview from './components/Overview/Overview';
import PageContext, {EPage} from './store/PageContext';
import LoadingComponent from './components/LoadingComponent/LoadingComponent';
import store from './store/store';

const App = () => {
    const [currentPage, setCurrentPage] = useState<EPage>(EPage.LOADING);
    const navigate = (page: EPage) => setCurrentPage(page);

    const renderPage = (page: EPage): JSX.Element => {
        switch(page) {
            case EPage.LOADING:
                return <LoadingComponent />
            case EPage.PLAYGROUND:
                return <Playground />
            case EPage.OVERVIEW:
                return <Overview />
            default:
                return <Welcome />
        }
    }

    return (
        <Provider store={store}>
            <PageContext.Provider value={{currentPage, navigate}}>
                { renderPage(currentPage) }
            </PageContext.Provider>
        </Provider>
    )
};

export default App;