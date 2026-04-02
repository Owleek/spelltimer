import React from 'react';
import {useSelector} from 'react-redux';
import {TStoreState} from '../../../store/store';
import { translateText } from '../../../utils/utils';
import '../../../styles/article.scss';
import ImageCover from '../../../components/ImageCover/ImageCover';
import SpriteIcon from '@shared/ui/SpriteIcon';

const AboutPage = () => {
    const {dictionary} = useSelector((state: TStoreState) => state.localeSlice);

    return <div className="Article">
        <ImageCover image="article.webp" />

        <div className="Article__body">
            <div className="adjustCenter">
                <div className="Article__bodyInner">
                    <div className='Article__contentHeader'>
                        <h2 className='Article__title'>
                            { translateText(dictionary, 'about') }
                            <span className="Article__titleIcon">
                                <SpriteIcon id="pages-aboutpage-about-1" />
                            </span>
                        </h2>
                    </div>
                    <div className="Article__contentWrapper appStyledScroll">
                        <div className="Article__content">
                            <p>{ translateText(dictionary, 'about_1') }</p>
                            <p>{ translateText(dictionary, 'about_2') }</p>
                            <p>{ translateText(dictionary, 'about_3') }</p>
                            <p>{ translateText(dictionary, 'about_4') }</p>
                            <p>{ translateText(dictionary, 'about_5') }</p>
                            <p>{ translateText(dictionary, 'about_6') }</p>
                            <p>{ translateText(dictionary, 'about_7') }</p>
                            <p className='Article__small'>{ translateText(dictionary, 'last_update') }</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default AboutPage;
