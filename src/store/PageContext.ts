import { createContext } from 'react';

export enum EPage {
    WELCOME = 'welcome',
    PLAYGROUND = 'playground',
    LOADING = 'loading',
    ABOUT = 'about',
    CONTACT = 'contact',
    POLITICS = 'politics',
    DONATION = 'donation'
}

export type TPage = EPage | null;

interface IPageContext {
    currentPage: EPage
    navigate: (page: EPage) => void
    activeArticle: TPage
    onSelectArticle: (selectedArticle: TPage) => void
    headerBottomOnMobile: boolean
}

const PageContext = createContext<IPageContext | null>(null);

export default PageContext;