'use client'
import { useAppMenuStore } from '.'
import { useTranslations } from 'next-intl'
import { AppLogo } from '../../shared/ui/AppLogo'
import Link from 'next/link'
import DonateIcon from '../../shared/ui/IconComponents/DonateIcon'
import cn from 'classnames'
import './AppMenu.scss'

export default function AppMenu() {
    const isMenuVisible = useAppMenuStore(state => state.isVisible)

    const translate = useTranslations('Footer')
    const links = ['about', 'contact', 'policy']

    return (
        <div className={cn('AppMenu', {visible: isMenuVisible})}>    
            <div className="AppMenu__header">
                <AppLogo />
            </div>

            <div className="AppMenu__body"></div>

            <div className="AppMenu__footer">
                <Link href={'/donation'} className="AppMenu__donateLink">
                    <DonateIcon className="AppMenu__donateIcon"/>
                </Link>
                
                { links.map(label => <Link key={label} href={`/${label}`} className="AppMenu__link">{translate(label)}</Link>) }

                <p className="AppMenu__text">© 2025 spelltimer.com</p>
                <p className="AppMenu__text">{translate('right')}</p>
            </div>
        </div>
    );
}