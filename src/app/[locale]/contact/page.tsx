import React from 'react'
import Social from './Social/Social'
import { useTranslations } from 'next-intl'
import ImageCover from '../../../shared/ui/ImageCover/ImageCover'
import ContactIcon from '../../../shared/ui/IconComponents/ContactIcon'
import GmailIcon from '../../../shared/ui/IconComponents/GmailIcon'
import TelegramIcon from '../../../shared/ui/IconComponents/TelegramIcon'
import XIcon from '../../../shared/ui/IconComponents/XIcon'
import AuthorIcon from '../../../shared/ui/IconComponents/AuthorIcon'
import ContractIcon from '../../../shared/ui/IconComponents/ContractIcon'
import cn from 'classnames'

const Contact = () => {
    const translate = useTranslations('ContactPage')

    const dictionary = {
        title: translate('title'),
        author: translate('author'),
        text_1: translate('text_1'),
        text_2: translate('text_2'),
        text_3: translate('text_3')
    }

    return <div className="Article">
        <ImageCover image="article.webp" />
        <div className="Article__body">
            <div className="adjustCenter">
                <div className="Article__bodyInner">
                    <div className='Article__contentHeader'>
                        <h2 className="Article__title">
                            {dictionary.title}
                            <ContactIcon className="Article__titleIcon" />
                        </h2>
                    </div>
                    <div className="Article__contentWrapper appStyledScroll">
                        <div className="Article__content">
                            <p>{dictionary.text_1}</p>
                            <div className="Article__socialList">
                                <div className="Article__social">
                                    <GmailIcon className="Article__socialIcon" />
                                    <Social className='Article__socialLink' deeplink='mailto:spelltimer@gmail.com'>spelltimer@gmail.com</Social>
                                </div>
                                <div className='Article__social'>
                                    <TelegramIcon className="Article__socialIcon" />
                                    <Social className='Article__socialLink' deeplink='tg://resolve?domain=spelltimer' link='https://t.me/spelltimer'>Telegram</Social>
                                </div>
                                <div className='Article__social'>
                                    <XIcon className="Article__socialIcon" />
                                    <Social className='Article__socialLink' deeplink='x://user?screen_name=spelltimer' link='https://x.com/spelltimer'>Twitter / X</Social>
                                </div>
                            </div>
                            
                            <div className="Article__headline">
                                <h2 className='Article__title'>
                                    <AuthorIcon className="Article__titleIcon" />
                                    {dictionary.author}
                                </h2>
                            </div>
                            <p>{dictionary.text_2}</p>
                            <p><span style={{marginRight: '15px'}}>{dictionary.text_3}</span>
                                <div className="Article__social">
                                    <ContractIcon className="Article__socialIcon" />
                                    <Social className='Article__socialLink' deeplink='mailto:artemy.hafizov@gmail.com'>artemy.hafizov@gmail.com</Social>
                                </div>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Contact;

