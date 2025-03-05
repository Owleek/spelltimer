import React, { useState } from 'react';
import { JSX } from 'react/jsx-runtime';
import './MainTime.scss';

interface IProps {
    isRun: boolean
    minutes: string
    seconds: string
    onClickTrigger: () => void
    onClickSettings: () => void
}

const MainTime = (props: IProps): JSX.Element => {
    const {isRun, minutes, seconds, onClickTrigger, onClickSettings} = props;

    return (
        <div className="MainTime">
            <div className="MainTime__container">
                <div className="MainTime__sets" onClick={onClickSettings}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 0 25 25" fill="none">
                        <path d="M12 7.82001H22" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 7.82001H4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 16.82H22" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 16.82H12" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 11.82C10.2091 11.82 12 10.0291 12 7.82001C12 5.61087 10.2091 3.82001 8 3.82001C5.79086 3.82001 4 5.61087 4 7.82001C4 10.0291 5.79086 11.82 8 11.82Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 20.82C18.2091 20.82 20 19.0291 20 16.82C20 14.6109 18.2091 12.82 16 12.82C13.7909 12.82 12 14.6109 12 16.82C12 19.0291 13.7909 20.82 16 20.82Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <div className="MainTime__digitBox">
                    <div className="MainTime__digits">
                        <span className="MainTime__minutes">{minutes}</span> : <span className="MainTime__seconds">{seconds}</span>
                    </div>
                </div>
                <span className="MainTime__button" onClick={onClickTrigger}>
                    {
                        isRun ? <span className="pause"></span> :
                        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http:www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4 4.11493C4 1.61163 6.88508 0.209383 8.85346 1.75597L18.8535 9.61312C19.5773 10.1819 20 11.0515 20 11.9721V12.0279C20 12.9485 19.5773 13.8181 18.8535 14.3869L8.85346 22.244C6.88507 23.7906 4 22.3884 4 19.8851V4.11493ZM7.61782 3.32861C6.96169 2.81308 6 3.2805 6 4.11493V19.8851C6 20.7195 6.96169 21.1869 7.61782 20.6714L17.6178 12.8142C17.8591 12.6247 18 12.3348 18 12.0279V11.9721C18 11.6652 17.8591 11.3753 17.6178 11.1858L7.61782 3.32861Z"/>
                        </svg>
                    }
                </span>
            </div>
        </div>
    )
}

export default MainTime;