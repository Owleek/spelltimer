import React from 'react'
import cn from 'classnames'
import ImageCover from '../../../shared/ui/ImageCover/ImageCover'
import AboutIcon from '../../../shared/ui/IconComponents/AboutIcon'
import { useTranslations } from 'next-intl'

const About = () => {    
    const translate = useTranslations('AboutPage')

    const paragraphsCount = 7;
    const paragraphs = Array.from({length: paragraphsCount}, (_, i) => translate(`text_${i + 1}`));

    return <div className="Article">
        <ImageCover image="article.webp" />
        
        <div className="Article__body">
            <div className="adjustCenter">
                <div className="Article__bodyInner">
                    <div className='Article__contentHeader'>
                        <h2 className='Article__title'>
                            { translate('title') }
                            <AboutIcon className="Article__titleIcon" />
                        </h2>
                    </div>
                    <div className="Article__contentWrapper appStyledScroll">
                        <div className="Article__content">
                            { paragraphs.map(p => <p key={ p }>{ p }</p>) }
                            <p className='Article__small'>{translate('last_update')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default About;

