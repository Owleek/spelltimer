import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {changeLocale, TLang} from '../../store/localeSlice';
import {TStoreState} from '../../store/store';
import cn from 'classnames';
import './LangSelector.scss';
import SpriteIcon from '@shared/ui/SpriteIcon';

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
                    <SpriteIcon id="components-langselector-langselector-1" />
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