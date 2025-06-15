// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import { JSX, useState } from 'react';
import { Provider } from 'react-redux';
import { YMInitializer } from 'react-yandex-metrika';
import Welcome from './components/Welcome/Welcome';
import Playground from './components/Playground/Playground';
import PageContext, {EPage} from './store/PageContext';
import LoadingComponent from './components/LoadingComponent/LoadingComponent';
import store from './store/store';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Politics from './components/Politics/Politics';
import Donation from './components/Donation/Donation';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

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

    const backToPlayground = currentPage === EPage.ABOUT || 
                             currentPage === EPage.CONTACT ||
                             currentPage === EPage.POLITICS || 
                             currentPage === EPage.DONATION;


    const hideLogoOnMobile = currentPage !== EPage.WELCOME && currentPage !== EPage.PLAYGROUND;

    return (
        <Provider store={store}>
            <PageContext.Provider value={{currentPage, navigate, activeArticle, onSelectArticle}}>
                <YMInitializer
                    accounts={[102442825]}
                    options={{ webvisor: true, clickmap: true, trackLinks: true }}
                    version="2"
                />
                <Header isPlaygroundButtonShown={backToPlayground} hideLogoOnMobile={hideLogoOnMobile}/>
                    { renderPage(currentPage) }
                <Footer />
            </PageContext.Provider>
        </Provider>
    )
};

export default App;

// <!-- Yandex.Metrika counter -->
// <script type="text/javascript" >
//    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
//    m[i].l=1*new Date();
//    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
//    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
//    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

//    ym(102442825, "init", {
//         clickmap:true,
//         trackLinks:true,
//         accurateTrackBounce:true,
//         webvisor:true
//    });
// </script>
// <noscript><div><img src="https://mc.yandex.ru/watch/102442825" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
// <!-- /Yandex.Metrika counter -->