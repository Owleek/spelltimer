import React from 'react';
import Social from '../contact/ui/social';
import {useSelector} from 'react-redux';
import {TStoreState} from '../../store/store';
import { translateText } from '../../utils/utils';
import useImageLoaded from '../../utils/useImageLoaded';
import cn from 'classnames';
import '../../article.scss';
import ImageCover from '../../components/ImageCover/ImageCover';
import SpriteIcon from '@shared/ui/SpriteIcon';

const Contact = () => {
    const {dictionary} = useSelector((state: TStoreState) => state.localeSlice);
    const { imageLoaded, onLoadImage } = useImageLoaded();

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
                            {/* <p>
                                <span style={{marginRight: '15px'}}>
                                    { translateText(dictionary, 'contact_1') }
                                </span>
                                <div className="Article__social">
                                    <span className="Article__socialIcon">
                                        <SpriteIcon id="pages-contactpage-contact-2" />
                                    </span>
                                    <Social className='Article__socialLink' deeplink='mailto:spelltimer@gmail.com'>spelltimer@gmail.com</Social>
                                </div>
                            </p> */}
                            {/* <div className="Article__socialList">
                                <div className="Article__social">
                                    <span className="Article__socialIcon">
                                        <SpriteIcon id="pages-contactpage-contact-2" />
                                    </span>
                                    <Social className='Article__socialLink' deeplink='mailto:spelltimer@gmail.com'>spelltimer@gmail.com</Social>
                                </div>
                                <div className='Article__social'>
                                    <span className="Article__socialIcon">
                                        <SpriteIcon id="pages-contactpage-contact-3" />
                                    </span>
                                    <Social className='Article__socialLink' deeplink='tg://resolve?domain=spelltimer' link='https://t.me/spelltimer'>Telegram</Social>
                                </div>
                                <div className='Article__social'>
                                    <span className="Article__socialIcon">
                                        <SpriteIcon id="pages-contactpage-contact-4" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" />
                                    </span>
                                    <Social className='Article__socialLink' deeplink='x://user?screen_name=spelltimer' link='https://x.com/spelltimer'>Twitter / X</Social>
                                </div>
                            </div> */}
                            
                            {/* <div className="Article__headline">
                                <h2 className='Article__title'>
                                    <span className="Article__titleIcon">
                                        <SpriteIcon id="pages-contactpage-contact-5" />
                                    </span>
                                    { translateText(dictionary, 'author') }
                                </h2>
                            </div> */}
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

export default Contact;

