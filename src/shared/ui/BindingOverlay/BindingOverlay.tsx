import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { JSX } from 'react/jsx-runtime';
import { useTranslations } from 'next-intl';

const BindingOverlay = (): JSX.Element => {
    const translate = useTranslations('PlaygroundPage.TimerPanel');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    
    const portalTarget = typeof document !== 'undefined' ? document.body : null;

    if (!mounted || !portalTarget) {
        return <></>;
    }

    return <React.Fragment>
        {
            ReactDOM.createPortal(<div className="GeneralOverlay">
                             <span className='GeneralOverlay__text'>{translate('press_to_bind')}</span>
                            </div>, portalTarget)
        }
    </React.Fragment>
}

export default BindingOverlay;