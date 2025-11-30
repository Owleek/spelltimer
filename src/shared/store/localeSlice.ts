import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {detectLocale} from '../lib/utils';
import {setLocale} from '../data/localStorageData';

import ru from '../i18n/ru.json';
import es from '../i18n/es.json';
import zh from '../i18n/zh.json';
import ar from '../i18n/ar.json';
import en from '../i18n/en.json';

export type TLang = 'ru' | 'en' | 'zh' | 'es' | 'ar';

const langHashmap = {
    ru: 'Русский',
    en: 'English',
    zh: '中文',
    es: 'español',
    ar: 'العربية'
}

const initialLang: Array<TLang> = Object.keys(langHashmap) as  Array<TLang>;

interface IState {
    dictionary: Record<string, any>
    langList: Array<TLang>
    currentLang: TLang
    hashMap: Record<TLang, string>
}

const dictionaries: Record<string, any> = { en, zh, es, ar, ru };
const currentLang: TLang = detectLocale() as TLang;
const dictionary = dictionaries[currentLang] || en;
const langList: Array<TLang> = initialLang.filter(el => el !== currentLang);

const initialLocale: IState = {dictionary, langList, currentLang: currentLang, hashMap: langHashmap};

export const localeSlice = createSlice({
    name: 'actionLocaleSlice',
    initialState: initialLocale,
    reducers: {
        changeLocale(state: IState, action: PayloadAction<{lang: TLang}>) {
            const currentLang = action.payload.lang;
            setLocale(currentLang);
            state.dictionary = dictionaries[currentLang];
            state.currentLang = currentLang;
            state.langList = initialLang.filter(el => el !== currentLang);
        }
    },
});

export const { changeLocale } = localeSlice.actions;

export default localeSlice.reducer;