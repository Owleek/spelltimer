'use client';
import React, { useState } from 'react'
import cn from 'classnames'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '../../../../i18n/navigation'
import { localeDictionary } from '../../../../i18n/locales';
import { routing } from '../../../../i18n/routing'
import './LocaleSwitcher.scss'

interface IProps {
    className?: string
}

const LocaleSwitcher = ({ className }: IProps) => {

    const localeList = routing.locales
    const currentLocale = useLocale()
    const router = useRouter()
    const pathName = usePathname()

    const [menuVisible, setMenuVisible] = useState<boolean>(false)

    const toggleMenu = () => {

        if (!!menuVisible) return;

        setMenuVisible(true);

        const clickFn = () => {
            setMenuVisible(false);
            document.removeEventListener('click', clickFn);
        }

        setTimeout(() => document.addEventListener('click', clickFn), 0);
    }

    const switchLocale = (l: string) => router.replace(pathName, {locale: l})

    return (
        <div className={cn('LocaleSwitcher', className, {keepActiveColor: menuVisible})}>

            <div className="LocaleSwitcher__head" onClick={toggleMenu}>
                <span className="LocaleSwitcher__code">
                    {
                        localeDictionary[currentLocale as keyof typeof localeDictionary]
                    }
                </span>
                <span className='LocaleSwitcher__arrow'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 59 22">
                        <path d="M30.7521 20.8663C29.8173 21.4123 28.6609 21.4123 27.7261 20.8663L1.57176 5.59052C-1.07172 4.04656 0.0234356 5.80966e-06 3.08478 5.54203e-06L55.3934 9.69061e-07C58.4547 7.01431e-07 59.5499 4.04655 56.9064 5.59051L30.7521 20.8663Z" />
                    </svg>
                </span>
            </div>

            <ul className={cn('LocaleSwitcher__menu', {visible: !!menuVisible})}>
                { localeList.map(l => {
                    return (
                        <li key={l} className={cn('LocaleSwitcher__item', {active: currentLocale === l}, {ar: l === 'ar'})} onClick={() => switchLocale(l)}>
                            {
                                localeDictionary[l as keyof typeof localeDictionary]
                            }
                        </li>
                    )
                  })
                } 
            </ul>
        </div>
    )
}

export default LocaleSwitcher

