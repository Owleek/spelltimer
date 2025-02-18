import { createContext } from 'react';

export enum EPage {
    WELCOME = 'welcome',
    PLAYGROUND = 'playground',
    OVERVIEW = 'overview',
    LOADING = 'loading'
}

interface IPageContext {
    currentPage: EPage
    navigate: (page: EPage) => void
}

const PageContext = createContext<IPageContext | null>(null);

export default PageContext;