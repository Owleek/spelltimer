import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {detectLocale} from '../utils/utils';
import {setLocale} from '../user_cache/keys';

import ru from '../assets/locales/ru.json';
import es from '../assets/locales/es.json';
import zh from '../assets/locales/zh.json';
import ar from '../assets/locales/ar.json';
import en from '../assets/locales/en.json';

export type TLang = 'en' | 'zh' | 'es' | 'ar' | 'ru';

const langHashmap = {
    en: 'English',
    zh: '中文',
    es: 'español',
    ar: 'العربية',
    ru: 'Русский'
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