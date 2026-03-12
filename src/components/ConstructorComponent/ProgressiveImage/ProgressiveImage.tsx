import React, { JSX } from 'react'
import cn from 'classnames'
import useImageLoaded from '../../../utils/useImageLoaded'
import './ProgressiveImage.scss'

interface IProps {
    img: string
    compressedImg: string
    altName: string
}

const ProgressiveImage = ({img, compressedImg, altName}: IProps): JSX.Element => {
    const { imageLoaded: placeholderLoaded, onLoadImage: onLoadPlaceholder } = useImageLoaded();
    const { imageLoaded, onLoadImage } = useImageLoaded();

    return (
        <React.Fragment>
            <img src={compressedImg} alt={altName || ''} className={cn('progressiveImage', {visible: placeholderLoaded, hide: imageLoaded})} onLoad={onLoadPlaceholder}/>
            <img src={img} alt={altName || ''} className={cn('progressiveImage', {visible: imageLoaded})} onLoad={onLoadImage}/>
        </React.Fragment>
    )
}

export default ProgressiveImage