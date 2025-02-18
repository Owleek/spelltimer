// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { JSX, useContext, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import Welcome from './components/Welcome/Welcome';
import Playground from './components/Playground/Activity';
import Overview from './components/Overview/Overview';
import PageContext, {EPage} from './store/pageContext';

const Loading = () => {
    const context = useContext(PageContext);
    if (!context) return <div>Error</div>

    useEffect(() => {
        const isUserDetected = localStorage.getItem('isUserDetected');
        isUserDetected ? context.navigate(EPage.PLAYGROUND) : context.navigate(EPage.WELCOME);
    }, []);

    return <div>loading ....</div>
}

const App = () => {
    const [currentPage, setCurrentPage] = useState<EPage>(EPage.LOADING);
    const navigate = (page: EPage) => setCurrentPage(page);

    const rendderPage = (page: EPage): JSX.Element => {
        switch(page) {
            case EPage.LOADING:
                return <Loading />
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
                { rendderPage(currentPage) }
            </PageContext.Provider>
        </Provider>
    )
};

export default App;