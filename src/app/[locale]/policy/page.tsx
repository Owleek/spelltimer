import React from 'react'
import cn from 'classnames'
import { useTranslations } from 'next-intl'
import ImageCover from '../../../shared/ui/ImageCover/ImageCover'
import PolicyIcon from '../../../shared/ui/IconComponents/PolicyIcon'

const Policy = () => {
    const translate = useTranslations('PolicyPage')
    
    const dictionary: Record<string, string> = {
        title: translate('title')
    }

    Array.from({length: 17}, (_, idx) => `text_${idx + 2}`).forEach(txt => dictionary[txt] = translate(txt))

    return <div className="Article">
        <ImageCover image="article.webp" />
        <div className="Article__body">
            <div className="adjustCenter">
                <div className="Article__bodyInner">
                    <div className='Article__contentHeader'>
                        <h2 className='Article__title'>
                            {dictionary.title}
                            <PolicyIcon className="Article__titleIcon" />
                        </h2>
                    </div>
                    <div className="Article__contentWrapper appStyledScroll">
                        <div className="Article__content">
                            <p>{dictionary.text_2} 31.05.2025</p>
                            <p>{dictionary.text_3}</p>
                            <h3 className="Article__subTitle">{dictionary.text_4}</h3>
                            <h4 className="Article__caption">{dictionary.text_5}</h4>
                            <p>{dictionary.text_6}</p>
                            <h4 className="Article__caption">{dictionary.text_7}</h4>
                            <p>{dictionary.text_8}</p>
                            <h3 className="Article__subTitle">{dictionary.text_9}</h3>
                            <p>{dictionary.text_10}</p>
                            <h3 className="Article__subTitle">{dictionary.text_11}</h3>
                            <p>{dictionary.text_12}</p>
                            <h3 className="Article__subTitle">{dictionary.text_13}</h3>
                            <p>{dictionary.text_14}</p>
                            <h3 className="Article__subTitle">{dictionary.text_15}</h3>
                            <p>{dictionary.text_16}</p>
                            <h3 className="Article__subTitle">{dictionary.text_17}</h3>
                            <p>{dictionary.text_18}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Policy

