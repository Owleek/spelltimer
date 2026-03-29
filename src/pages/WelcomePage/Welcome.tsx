import React, {useContext, useEffect} from 'react';
import PageContext, {EPage} from '../../store/PageContext';
import { translateText } from '../../utils/utils';
import { useSelector } from 'react-redux';
import {TStoreState} from '../../store/store';
import PlayButton from '../../components/PlayButton/PlayButton';
import cn from 'classnames';
import { useState } from 'react';
import useImageLoaded from '../../utils/useImageLoaded';
import './welcome.scss';
import SpriteIcon from '@shared/ui/SpriteIcon';


const Welcome = () => {
    const context = useContext(PageContext);
    if (!context) throw new Error('Context not found on Welcome page');

    const {dictionary, currentLang} = useSelector((state: TStoreState) => state.localeSlice);
    if (!dictionary) return;

    const fontStyleNormal = currentLang === 'ar' || currentLang === 'zh';
    const [videoShown, setVideoShown] = useState<boolean>(false);

    const { imageLoaded: heroPlaceholderLoaded, onLoadImage: onLoadHeroPlaceholder } = useImageLoaded();
    const { imageLoaded: heroLoaded, onLoadImage: onLoadHero } = useImageLoaded();

    useEffect(() => {
        
    }, [])

    return <React.Fragment>
        <div className="Welcome">
            <img src="/assets/other/compressed/welcome.webp" alt="Размытое изображение пейзажа карты дота 2" className={cn('Welcome__heroImage', {visible: heroPlaceholderLoaded, hide: heroLoaded})} onLoad={onLoadHeroPlaceholder}/>
            <img src="/assets/other/welcome.webp" alt="Атмосферный пейзаж карты дота 2" className={cn('Welcome__heroImage', {visible: heroLoaded})} onLoad={onLoadHero}/>

            <div className="Welcome__content">
                <div className="Welcome__titleStripe">
                    <h1 className={cn('Welcome__title', {fontStyleNormal})}>{translateText(dictionary, 'welcome_title')}</h1>
                </div>
                <PlayButton />
                { currentLang === 'ru' && <div className="Welcome__guideText" onClick={() => setVideoShown(true)}>Как пользоваться ?</div> }
                {
                    videoShown &&
                    <div className="Welcome__videoContainer">
                        <div className="Welcome__videoClose" onClick={() => setVideoShown(false)}>
                            <SpriteIcon id="pages-welcomepage-welcome-1" />
                        </div>
                        <div className="Welcome__outerBox">
                            <div className="Welcome__videoBox">
                                <iframe src="https://rutube.ru/play/embed/879b688d6d669606214133229bd45db9/" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    </React.Fragment> 
} ;

export default Welcome;

