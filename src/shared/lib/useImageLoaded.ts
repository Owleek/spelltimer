import { useState, useContext, useCallback } from 'react';
import PageContext from '../store/PageContext';

export const useImageLoaded = () => {

    const context = useContext(PageContext);
    if (!context) throw new Error('PageContext not found');

    const [imageLoaded, setImageLoaded] = useState(false);

    const onLoadImage = useCallback(() => {
        setImageLoaded(true);
        context.setLoading(false);
    }, [context]);

    return { imageLoaded, onLoadImage };
}

export default useImageLoaded;

