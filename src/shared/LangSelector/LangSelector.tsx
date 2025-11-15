import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {changeLocale, TLang} from '../../store/localeSlice';
import {TStoreState} from '../../store/store';
import cn from 'classnames';
import './LangSelector.scss';

interface IProps {
    className?: string
}

const LangSelector = ({className}: IProps) => {
    const dispatch = useDispatch();

    const {currentLang, dictionary, hashMap, langList} = useSelector((state: TStoreState) => state.localeSlice);

    if (!langList || !currentLang || !dictionary || !hashMap) return;

    const [menuVisible, setMenuVisible] = useState<boolean>(false);

    const handleClick = () => {
        if (!!menuVisible) return;
        setMenuVisible(true);

        const clickFn = () => {
            setMenuVisible(false);
            document.removeEventListener('click', clickFn);
        }

        setTimeout(() => document.addEventListener('click', clickFn), 0);
    }

    const handleClickLang = (lang: TLang) => {
        dispatch(changeLocale({lang}));
    }

    return (
        <div className={cn('LangSelector', className)}>
            <div className="LangSelector__head" onClick={handleClick}>
                <span className="LangSelector__code">{hashMap[currentLang]}</span>
                <span className='LangSelector__arrow'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 59 22">
                        <path d="M30.7521 20.8663C29.8173 21.4123 28.6609 21.4123 27.7261 20.8663L1.57176 5.59052C-1.07172 4.04656 0.0234356 5.80966e-06 3.08478 5.54203e-06L55.3934 9.69061e-07C58.4547 7.01431e-07 59.5499 4.04655 56.9064 5.59051L30.7521 20.8663Z" />
                    </svg>
                </span>
            </div>
            <ul className={cn('LangSelector__menu', {visible: !!menuVisible})}>
                {
                    langList.map(item => 
                        <li key={item} className={cn('LangSelector__item', {ar: item === 'ar'})} onClick={() => handleClickLang(item)}>{hashMap[item]}</li>
                    )
                }
            </ul>
        </div>
    );

}

export default LangSelector;

