import React from 'react';
import Social from '../../ui/social';
import {useSelector} from 'react-redux';
import {TStoreState} from '../../../store/store';
import { translateText } from '../../../utils/utils';
import '../../../styles/article.scss';
import ImageCover from '../../../components/ImageCover/ImageCover';
import SpriteIcon from '@shared/ui/SpriteIcon';

const ContactPage = () => {
    const {dictionary} = useSelector((state: TStoreState) => state.localeSlice);

    return <div className="Article">
        <ImageCover image="article.webp" />

        <div className="Article__body">
            <div className="adjustCenter">
                <div className="Article__bodyInner">
                    <div className='Article__contentHeader'>
                        <h2 className="Article__title">
                            { translateText(dictionary, 'contact') }
                            <span className="Article__titleIcon">
                                <SpriteIcon id="pages-contactpage-contact-1" />
                            </span>
                        </h2>
                    </div>
                    <div className="Article__contentWrapper appStyledScroll">
                        <div className="Article__content">
                            <p>{ translateText(dictionary, 'contact_2') }</p>
                            <p>
                                <span style={{marginRight: '15px'}}>{ translateText(dictionary, 'contact_1') }</span>
                                <div className="Article__social">
                                    <span className="Article__socialIcon">
                                        <SpriteIcon id="pages-contactpage-contact-2" />
                                    </span>
                                    <Social className='Article__socialLink' deeplink='mailto:spelltimer@gmail.com'>spelltimer@gmail.com</Social>
                                </div>
                            </p>
                            <p><span style={{marginRight: '15px'}}>{ translateText(dictionary, 'contact_3') }</span>
                                <div className="Article__social">
                                    <span className="Article__socialIcon">
                                        <SpriteIcon id="pages-contactpage-contact-6" />
                                    </span>
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

export default ContactPage;
