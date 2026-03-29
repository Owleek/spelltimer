import { JSX, useState } from 'react';
import { YMInitializer } from 'react-yandex-metrika';
import WelcomePage from '@pages/welcome';
import PlaygroundPage from '@pages/playground';
import AboutPage from '@pages/about';
import ContactPage from '@pages/contact';
import PoliticsPage from '@pages/politics';
import DonationPage from '@pages/donation';
import PageContext, { EPage, TPage } from '@pages/navigation/model/page-context';
import { SvgSpriteDefinitions } from '@shared/ui/SpriteIcon';
import StoreProvider from './providers/store-provider';
import AppShell from './layout/app-shell';

const App = (): JSX.Element => {
    const [currentPage, setCurrentPage] = useState<EPage>(EPage.WELCOME);
    const [loading, setLoading] = useState<boolean>(false);
    const [activeArticle, setActiveArticle] = useState<TPage>(null);
    const [headerBottomOnMobile, setHeaderBottomOnMobile] = useState<boolean>(false);

    const navigate = (page: EPage) => {
        setLoading(true);
        setCurrentPage(page);
    };

    const onSelectArticle = (selectedArticle: TPage) => {
        setActiveArticle(selectedArticle);
        setHeaderBottomOnMobile(false);

        return selectedArticle === null ? navigate(EPage.WELCOME) : navigate(selectedArticle);
    };

    const renderPage = (page: EPage): JSX.Element => {
        switch (page) {
            case EPage.PLAYGROUND:
                return <PlaygroundPage />;
            case EPage.ABOUT:
                return <AboutPage />;
            case EPage.CONTACT:
                return <ContactPage />;
            case EPage.POLITICS:
                return <PoliticsPage />;
            case EPage.DONATION:
                return <DonationPage />;
            default:
                return <WelcomePage />;
        }
    };

    const backToPlayground = currentPage === EPage.ABOUT ||
        currentPage === EPage.CONTACT ||
        currentPage === EPage.POLITICS ||
        currentPage === EPage.DONATION;

    const hideLogoOnMobile = currentPage !== EPage.WELCOME && currentPage !== EPage.PLAYGROUND;
    const playgroundMode = currentPage === EPage.PLAYGROUND;

    return (
        <StoreProvider>
            <PageContext.Provider value={{currentPage, navigate, activeArticle, onSelectArticle, headerBottomOnMobile, loading, setLoading}}>
                <SvgSpriteDefinitions />
                <YMInitializer
                    accounts={[102442825]}
                    options={{webvisor: true, clickmap: true, trackLinks: true}}
                    version="2"
                />
                <AppShell
                    backToPlayground={backToPlayground}
                    hideLogoOnMobile={hideLogoOnMobile}
                    playgroundMode={playgroundMode}
                    headerBottomOnMobile={headerBottomOnMobile}
                    onToggleMobileHeader={() => setHeaderBottomOnMobile((prev) => !prev)}
                >
                    {renderPage(currentPage)}
                </AppShell>
            </PageContext.Provider>
        </StoreProvider>
    );
};

export default App;
