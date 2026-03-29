import React, { useContext } from 'react';
import {useSelector} from 'react-redux';
import {TStoreState} from '../../store/store';
import ErrorComponent from '../ErrorComponent/ErrorComponent';
import PageContext, { EPage } from '../../store/PageContext';
import { translateText } from '../../utils/utils';
import cn from 'classnames';
import './footer.scss';
import SpriteIcon from '@shared/ui/SpriteIcon';

const Footer = ({className}: {className: string}) => {
    const {dictionary} = useSelector((state: TStoreState) => state.localeSlice);
    if (!dictionary) return;

    const context = useContext(PageContext);
    if (!context) return <ErrorComponent message={String(context)}/>
    const {activeArticle, onSelectArticle, headerBottomOnMobile} = context;

    return (
        <div className={cn('footer', className, {headerBottomOnMobile})}>
            <div className="footer__column">
                <ul className="footer__list">
                    <li className={cn('footer__item', {active: activeArticle === EPage.ABOUT})} onClick={() => onSelectArticle(EPage.ABOUT)} style={{whiteSpace: 'nowrap'}}>{translateText(dictionary, 'about')}</li>
                    <li className={cn('footer__item', {active: activeArticle === EPage.CONTACT})} onClick={() => onSelectArticle(EPage.CONTACT)}>{translateText(dictionary, 'contact')}</li>
                    <li className={cn('footer__item', {active: activeArticle === EPage.POLITICS})} onClick={() => onSelectArticle(EPage.POLITICS)}>{translateText(dictionary, 'policy')}</li>
                </ul>
            </div>
            <div className="footer__column rights">
                <p className="footer__item">© 2026 spelltimer.com</p>
                <p className="footer__item">{translateText(dictionary, 'rights')}</p>
            </div>
            <div className={cn('footer__donationButton', {active: activeArticle === EPage.DONATION})} onClick={() => onSelectArticle(EPage.DONATION)} title={translateText(dictionary, 'support')}>
                <SpriteIcon id="components-footer-footer-1" />
            </div>
        </div>
    );
} ;

export default Footer;