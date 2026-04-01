import React from 'react';
import {useSelector} from 'react-redux';
import {TStoreState} from '../../../store/store';
import { translateText } from '../../../utils/utils';
import '../../../article.scss';
import ImageCover from '../../../components/ImageCover/ImageCover';
import SpriteIcon from '@shared/ui/SpriteIcon';

const PoliticsPage = () => {
    const {dictionary} = useSelector((state: TStoreState) => state.localeSlice);

    return <div className="Article">
        <ImageCover image="article.webp" />
        <div className="Article__body">
            <div className="adjustCenter">
                <div className="Article__bodyInner">
                    <div className='Article__contentHeader'>
                        <h2 className='Article__title'>
                            { translateText(dictionary, 'politics_1') }
                            <span className="Article__titleIcon">
                                <SpriteIcon id="pages-politicspage-politics-1" />
                            </span>
                        </h2>
                    </div>
                    <div className="Article__contentWrapper appStyledScroll">
                        <div className="Article__content">
                            <p>{ translateText(dictionary, 'politics_2') } 31.05.2025</p>
                            <p>{ translateText(dictionary, 'politics_3') }</p>
                            <h3 className="Article__subTitle">{ translateText(dictionary, 'politics_4') }</h3>
                            <h4 className="Article__caption">{ translateText(dictionary, 'politics_5') }</h4>
                            <p>{ translateText(dictionary, 'politics_6') }</p>
                            <h4 className="Article__caption">{ translateText(dictionary, 'politics_7') }</h4>
                            <p>{ translateText(dictionary, 'politics_8') }</p>
                            <h3 className="Article__subTitle">{ translateText(dictionary, 'politics_9') }</h3>
                            <p>{ translateText(dictionary, 'politics_10') }</p>
                            <h3 className="Article__subTitle">{ translateText(dictionary, 'politics_11') }</h3>
                            <p>{ translateText(dictionary, 'politics_12') }</p>
                            <h3 className="Article__subTitle">{ translateText(dictionary, 'politics_13') }</h3>
                            <p>{ translateText(dictionary, 'politics_14') }</p>
                            <h3 className="Article__subTitle">{ translateText(dictionary, 'politics_15') }</h3>
                            <p>{ translateText(dictionary, 'politics_16') }</p>
                            <h3 className="Article__subTitle">{ translateText(dictionary, 'politics_17') }</h3>
                            <p>{ translateText(dictionary, 'politics_18') }</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default PoliticsPage;
