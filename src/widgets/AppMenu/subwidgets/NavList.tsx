'use client'
import React from 'react'
import Link from 'next/link'
import AboutIcon from '../../../shared/ui/IconComponents/AboutIcon'
import ContactIcon from '../../../shared/ui/IconComponents/ContactIcon'
import PolicyIcon from '../../../shared/ui/IconComponents/PolicyIcon'
import './NavList.scss'


export default function NavList() {

    return (
        <ul className="AppMenu__navList">
            <Link href="/about" className="AppMenu__navLink">
                <div className="AppMenu__navItem">
                    <AboutIcon className="AppMenu__navIcon" />
                    <div className="AppMenu__navText">О приложении</div>
                </div>
            </Link>

            <Link href="/contact" className="AppMenu__navLink">
                <div className="AppMenu__navItem">
                    <ContactIcon className="AppMenu__navIcon" />
                    <div className="AppMenu__navText">Контакты</div>
                </div>
            </Link>

            <Link href="/policy" className="AppMenu__navLink">
                <div className="AppMenu__navItem">
                    <PolicyIcon className="AppMenu__navIcon" />
                    <div className="AppMenu__navText">Политика</div>
                </div>
            </Link>
        </ul>
    );
}