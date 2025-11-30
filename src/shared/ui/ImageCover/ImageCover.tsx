'use client';
import React from 'react';
import useImageLoaded from '../../lib/useImageLoaded';
import cn from 'classnames';

const ImageCover = ({ image }: { image: string }) => {

    const { imageLoaded: heroPlaceholderLoaded, onLoadImage: onLoadHeroPlaceholder } = useImageLoaded();
    const { imageLoaded: heroLoaded, onLoadImage: onLoadHero } = useImageLoaded();

    const path = `/assets/other/${image}`;
    const pathCompressed = `/assets/other/compressed/${image}`;

    return <React.Fragment>
        <img src={pathCompressed} alt="Размытое изображение пейзажа карты дота 2" className={cn('imageBackground', {visible: heroPlaceholderLoaded, hide: heroLoaded})} onLoad={onLoadHeroPlaceholder}/>
        <img src={path} alt="Атмосферный пейзаж карты дота 2" className={cn('imageBackground', {visible: heroLoaded})} onLoad={onLoadHero}/>
    </React.Fragment>  
}

export default ImageCover;

