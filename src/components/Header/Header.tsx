import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ErrorComponent from '../ErrorComponent/ErrorComponent';
import PageContext, { EPage } from '../../store/PageContext';
import {TStoreState} from '../../store/store';
import LangSelector from '../LangSelector/LangSelector';
import PlayButton from '../PlayButton/PlayButton';
import cn from 'classnames';
import './header.scss';
import SpriteIcon from '@shared/ui/SpriteIcon';

interface IProps {
    className?: string
    isPlaygroundButtonShown?: boolean
    hideLogoOnMobile?: boolean
}

const Header = ({className, isPlaygroundButtonShown, hideLogoOnMobile}: IProps) => {
    const context = useContext(PageContext);

    if (!context) return <ErrorComponent message={String(context)}/>

    const {onSelectArticle, headerBottomOnMobile} = context;
    const handleClick = () => onSelectArticle(null);

    const {currentLang} = useSelector((state: TStoreState) => state.localeSlice);

    useEffect(() => {
        document.body.classList.toggle('textRight', currentLang === 'ar');
    }, [currentLang]);

    return (
        <div className={cn('header', className, {alignCenter: !!isPlaygroundButtonShown, hideLogoOnMobile, headerBottomOnMobile})}>
            <div className="header__logo">
                <SpriteIcon id="components-header-header-1" onClick={handleClick} />
            </div>
            {
                isPlaygroundButtonShown &&
                <PlayButton small={true} className='header__button'/>
            }
            <LangSelector className='header__langSelector'/>
        </div>
    );
} ;

export default Header;