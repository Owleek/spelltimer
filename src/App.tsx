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
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Politics from './components/Politics/Politics';
import Donation from './components/Donation/Donation';

const App = () => {
    
    const [currentPage, setCurrentPage] = useState<EPage>(EPage.LOADING);
    const navigate = (page: EPage) => setCurrentPage(page);

    const [activeArticle, setActiveArticle] = useState<EPage | null>(null);

    const onSelectArticle = (selectedArticle: EPage | null) => {
        setActiveArticle(selectedArticle);
        return selectedArticle === null ? navigate(EPage.WELCOME) : navigate(selectedArticle);
    }

    const renderPage = (page: EPage): JSX.Element => {
        switch(page) {
            case EPage.LOADING:
                return <LoadingComponent />
            case EPage.PLAYGROUND:
                return <Playground/>
            case EPage.OVERVIEW:
                return <Overview />
            case EPage.ABOUT:
                return <About />
            case EPage.CONTACT:
                return <Contact />
            case EPage.POLITICS:
                return <Politics />
            case EPage.DONATION:
                return <Donation />
            default:
                return <Welcome/>
        }
    }

    return (
        <Provider store={store}>
            <PageContext.Provider value={{currentPage, navigate, activeArticle, onSelectArticle}}>
                { renderPage(currentPage) }
            </PageContext.Provider>
        </Provider>
    )
};

export default App;