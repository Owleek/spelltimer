'use client';
import cn from 'classnames';
import useImageLoaded from '../../../shared/lib/useImageLoaded';

interface IProps {
    img: string
    compressedImg: string
    altName: string
}

const ProgressiveImage = ({ img, compressedImg, altName }: IProps) => {
    const { imageLoaded: placeholderLoaded, onLoadImage: onLoadPlaceholder } = useImageLoaded();
    const { imageLoaded, onLoadImage } = useImageLoaded();

    return (
        <>
            <img
                src={compressedImg}
                alt={altName}
                className={cn('imageBackground', { visible: placeholderLoaded && !imageLoaded })}
                onLoad={onLoadPlaceholder}
            />
            <img
                src={img}
                alt={altName}
                className={cn('imageBackground', { visible: imageLoaded })}
                onLoad={onLoadImage}
            />
        </>
    );
};

export default ProgressiveImage;
