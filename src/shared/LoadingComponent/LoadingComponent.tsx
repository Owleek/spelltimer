import React, { JSX, useContext, useEffect } from 'react';
import PageContext, {EPage} from '../../store/PageContext';
import {isUserPlayed} from '../../user_cache/keys';

const LoadingComponent = (): JSX.Element => {
    const context = useContext(PageContext);

    if (!context) return <div></div>

    useEffect(() => {
        isUserPlayed() ? context.navigate(EPage.WELCOME) : context.navigate(EPage.WELCOME);
    }, []);

    return <div>loading ....</div>
}

export default LoadingComponent;

