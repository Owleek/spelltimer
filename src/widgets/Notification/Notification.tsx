import React, { JSX, useContext, useEffect, useState } from 'react';
import { translateText } from '../../shared/lib/utils';
import {TStoreState} from '../../shared/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';
import StageContext, {EStages} from '../../shared/store/StageContext';
import { hideNotificationOfRunning } from '../../shared/store/noteSlice';
import cn from 'classnames';
import './Notification.scss';

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
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                    <path d="M26 47.875C13.9188 47.875 4.125 38.0812 4.125 26C4.125 13.9188 13.9188 4.125 26 4.125C38.0812 4.125 47.875 13.9188 47.875 26C47.875 38.0812 38.0812 47.875 26 47.875ZM26 51C39.8071 51 51 39.8071 51 26C51 12.1929 39.8071 1 26 1C12.1929 1 1 12.1929 1 26C1 39.8071 12.1929 51 26 51Z" />
                                    <path d="M22.8798 35.375C22.8798 33.6491 24.2789 32.25 26.0048 32.25C27.7307 32.25 29.1298 33.6491 29.1298 35.375C29.1298 37.1009 27.7307 38.5 26.0048 38.5C24.2789 38.5 22.8798 37.1009 22.8798 35.375Z" />
                                    <path d="M23.1859 16.6095C23.0195 14.9446 24.3268 13.5 26 13.5C27.6732 13.5 28.9805 14.9446 28.8141 16.6095L27.718 27.5703C27.6297 28.4529 26.887 29.125 26 29.125C25.113 29.125 24.3703 28.4529 24.282 27.5703L23.1859 16.6095Z" />
                                    <path d="M23.1859 16.6095L23.6835 16.5597L23.6835 16.5597L23.1859 16.6095ZM28.8141 16.6095L28.3165 16.5597L28.3165 16.5597L28.8141 16.6095ZM27.718 27.5703L27.2205 27.5205L27.2205 27.5205L27.718 27.5703ZM24.282 27.5703L24.7795 27.5205L24.7795 27.5205L24.282 27.5703ZM47.375 26C47.375 37.8051 37.8051 47.375 26 47.375V48.375C38.3574 48.375 48.375 38.3574 48.375 26H47.375ZM26 4.625C37.8051 4.625 47.375 14.1949 47.375 26H48.375C48.375 13.6426 38.3574 3.625 26 3.625V4.625ZM4.625 26C4.625 14.1949 14.1949 4.625 26 4.625V3.625C13.6426 3.625 3.625 13.6426 3.625 26H4.625ZM26 47.375C14.1949 47.375 4.625 37.8051 4.625 26H3.625C3.625 38.3574 13.6426 48.375 26 48.375V47.375ZM50.5 26C50.5 39.531 39.531 50.5 26 50.5V51.5C40.0833 51.5 51.5 40.0833 51.5 26H50.5ZM26 1.5C39.531 1.5 50.5 12.469 50.5 26H51.5C51.5 11.9167 40.0833 0.5 26 0.5V1.5ZM1.5 26C1.5 12.469 12.469 1.5 26 1.5V0.5C11.9167 0.5 0.5 11.9167 0.5 26H1.5ZM26 50.5C12.469 50.5 1.5 39.531 1.5 26H0.5C0.5 40.0833 11.9167 51.5 26 51.5V50.5ZM23.3798 35.375C23.3798 33.9253 24.5551 32.75 26.0048 32.75V31.75C24.0028 31.75 22.3798 33.373 22.3798 35.375H23.3798ZM26.0048 32.75C27.4546 32.75 28.6298 33.9253 28.6298 35.375H29.6298C29.6298 33.373 28.0068 31.75 26.0048 31.75V32.75ZM28.6298 35.375C28.6298 36.8247 27.4546 38 26.0048 38V39C28.0068 39 29.6298 37.377 29.6298 35.375H28.6298ZM26.0048 38C24.5551 38 23.3798 36.8247 23.3798 35.375H22.3798C22.3798 37.377 24.0028 39 26.0048 39V38ZM23.6835 16.5597C23.5464 15.1892 24.6227 14 26 14V13C24.031 13 22.4925 14.7 22.6884 16.6592L23.6835 16.5597ZM26 14C27.3773 14 28.4536 15.1892 28.3165 16.5597L29.3116 16.6592C29.5075 14.7 27.969 13 26 13V14ZM28.3165 16.5597L27.2205 27.5205L28.2155 27.62L29.3116 16.6592L28.3165 16.5597ZM27.2205 27.5205C27.1578 28.1475 26.6301 28.625 26 28.625V29.625C27.1439 29.625 28.1017 28.7582 28.2155 27.62L27.2205 27.5205ZM26 28.625C25.3699 28.625 24.8422 28.1475 24.7795 27.5205L23.7845 27.62C23.8983 28.7582 24.8561 29.625 26 29.625V28.625ZM24.7795 27.5205L23.6835 16.5597L22.6884 16.6592L23.7845 27.62L24.7795 27.5205Z" />
                                </svg>
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

