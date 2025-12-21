'use client'
import React from 'react'
import { useAppMenuStore } from '.'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import cn from 'classnames'

import { AppLogo } from '../../shared/ui/AppLogo'
import DonateIcon from '../../shared/ui/IconComponents/DonateIcon'
import AboutIcon from '../../shared/ui/IconComponents/AboutIcon'
import ContactIcon from '../../shared/ui/IconComponents/ContactIcon'
import PolicyIcon from '../../shared/ui/IconComponents/PolicyIcon'

import './AppMenu.scss'
import NavList from './subwidgets/NavList'


export default function AppMenu() {
    const isMenuVisible = useAppMenuStore(state => state.isVisible)
    const setVisible = useAppMenuStore(state => state.actions.setVisible)

    const icons = {
        about: AboutIcon,
        contact: ContactIcon,
        policy: PolicyIcon
    }

    const translate = useTranslations('Footer')
    const links = ['about', 'contact', 'policy']

    const hideMenu = () => setVisible(false)

    return (
        <React.Fragment>
            <div className={cn('AppMenu', {visible: isMenuVisible})}>    
                <div className="AppMenu__header">
                    <AppLogo />
                </div>

                <div className="AppMenu__body">
                    <div className="AppMenu__title divider">
                        Разделы
                    </div>
                    <NavList />
                    {/* <div className="AppMenu__title divider">
                        Настройки
                    </div> */}
                </div>
                <div className="AppMenu__footer">
                    <Link href={'/donation'} className="AppMenu__donateLink">
                        <DonateIcon className="AppMenu__donateIcon"/>
                    </Link>
                    <p className="AppMenu__text">© 2025 spelltimer.com</p>
                    <p className="AppMenu__text">{translate('right')}</p>
                </div>
            </div>
            <div className={cn('AppMenuClickCatcher', {visible: isMenuVisible})} onClick={hideMenu}></div>
    </React.Fragment>
    );
}