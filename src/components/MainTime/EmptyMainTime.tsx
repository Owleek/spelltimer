import React, { useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { JSX } from 'react/jsx-runtime';
import { useDispatch } from 'react-redux';
import { setHotkey } from '../../store/hotkeySlice';
import cn from 'classnames';
import {TStoreState} from '../../store/store';
import './MainTime.scss';
import { translate } from '../../utils/utils';

interface IProps {
}

const EmptyMainTime = (props: IProps): JSX.Element => {
    const dispatch = useDispatch();
    const bindKey = useSelector((state: TStoreState) => state.timeSlice.key);
    const [isBinding, setIsBinding] = useState<boolean>(false);

    const getKey = useCallback((event: KeyboardEvent) => {
        const keyIs = event.key.toUpperCase();
        setIsBinding(false);
        document.removeEventListener('keydown', getKey);
        dispatch(setHotkey({key: keyIs, type: 'time'}));
    }, []);

    const onBindHotKey = () => {
        setIsBinding(true);
        document.addEventListener('keydown', getKey);
    }

    return (
        <div className="MainTime empty">
            {
                isBinding && ReactDOM.createPortal(<div className="GeneralOverlay"></div>, document.getElementById('root') as HTMLElement)
            }

            <div className="MainTime__container">
                <div className="MainTime__digitBox">
                    <div className="MainTime__digits">
                        <span className="MainTime__minutes">{'00'}</span> : <span className="MainTime__seconds">{'00'}</span>
                    </div>
                </div>
                <div className={cn('MainTime__hotkey', {onTopOfTheSky: isBinding})} onClick={!isBinding ? onBindHotKey : () => null}>
                    {
                        isBinding ? <span className='MainTime__hotKeySecondary'>{translate('Press any key to bind')}</span> :
                                   <React.Fragment>
                                        <div className="MainTime__hotkeyMain">{bindKey}</div>
                                        <div className="MainTime__hotKeySecondary">{translate('play/stop')}</div>
                                   </React.Fragment>
                    }
                </div>
            </div>
        </div>
    )
}

export default EmptyMainTime;