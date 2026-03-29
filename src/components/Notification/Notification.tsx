import React, { JSX, useContext, useEffect, useState } from 'react';
import { translateText } from '../../utils/utils';
import {TStoreState} from '../../store/store';
import { useSelector, useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';
import StageContext, {EStages} from '../../store/StageContext';
import { hideNotificationOfRunning } from '../../store/noteSlice';
import cn from 'classnames';
import './Notification.scss';
import SpriteIcon from '@shared/ui/SpriteIcon';

const Notification = (): JSX.Element => {

    const dispatch = useDispatch();
    
    const [checked, setChecked] = useState<boolean>(false);

    const noteHidden = useSelector((state: TStoreState) => state.noteSlice.value);

    const {currentStage, changeStage} = useContext(StageContext);

    const initialIsVisible = currentStage === EStages.EDIT && !noteHidden;

    const [visible, setVisible] = useState<boolean>(initialIsVisible);

    const {dictionary} = useSelector((state: TStoreState) => state.localeSlice);


    useEffect(() => {
        const isVisibility = currentStage === EStages.EDIT && !noteHidden;
        setVisible(isVisibility);
    }, [currentStage, noteHidden]);

    const handleChange = (event: any) => {
        setChecked(event.target.checked);
    }

    const handleClick = () => {
        dispatch(hideNotificationOfRunning(checked ? 'storage' : 'temp'));
    }

    return (
        <React.Fragment>
            {
                createPortal(
                    <div className={cn('Notification', {visible})}>
                        <div className="Notification__info">
                            <span className="Notification__infoIcon">
                                <SpriteIcon id="components-notification-notification-1" />
                            </span>
                            <p className="Notification__text">{translateText(dictionary, 'notification')}</p>
                        </div>
                        <div className="Notification__actions">
                            <div className="Notification__checkboxContainer">
                                <input type="checkbox" id="customCheckbox" onChange={handleChange} checked={checked}/>
                                <label htmlFor="customCheckbox" className='Notification__checkboxLabel'>{translateText(dictionary, 'notification_checkbox')}</label>
                            </div>
                            <div className="Notification__button" onClick={handleClick}>{translateText(dictionary, 'ok')}</div>
                        </div>

                    </div>, document.body)
            }
        </React.Fragment>
    );
} ;

export default Notification;