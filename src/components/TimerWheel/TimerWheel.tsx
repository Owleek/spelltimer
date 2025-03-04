import React, { useRef } from 'react';
import './TimerWheel.scss';

interface IProps {
    numbers: Array<number>
    currentValue: number
    onChange: (value: number) => void
}



const TimerWheel = ({numbers, currentValue, onChange}: IProps) => {

    const handleMouseDown = () => {

    }

    const handleMouseMove = () => {

    }

    const handleMouseUp = () => {

    }

    return (
        <div className="TimerWheel">
            <span className="TimerWheel__up">
                <svg viewBox="0 0 511.995 511.995">
                    <path d="M509.758,480.649L275.091,11.315c-7.232-14.464-30.955-14.464-38.187,0L2.238,480.649    c-4.267,8.576-2.304,18.944,4.8,25.365c7.147,6.464,17.664,7.317,25.749,2.176l223.211-142.037l223.21,142.037    c3.52,2.219,7.488,3.328,11.456,3.328c5.141,0,10.261-1.856,14.293-5.504C512.062,499.593,514.024,489.225,509.758,480.649z"/>
                </svg>
            </span>
            <div className="TimerWheel__frame">
                <div className="TimerWheel__track">
                    <div className="TimerWheel__digit previous">1</div>
                    <div className="TimerWheel__digit current">2</div>
                    <div className="TimerWheel__digit next">3</div>
                </div>
            </div>
            <span className="TimerWheel__down">
                <svg viewBox="0 0 511.995 511.995">
                    <path d="M509.758,480.649L275.091,11.315c-7.232-14.464-30.955-14.464-38.187,0L2.238,480.649    c-4.267,8.576-2.304,18.944,4.8,25.365c7.147,6.464,17.664,7.317,25.749,2.176l223.211-142.037l223.21,142.037    c3.52,2.219,7.488,3.328,11.456,3.328c5.141,0,10.261-1.856,14.293-5.504C512.062,499.593,514.024,489.225,509.758,480.649z"/>
                </svg>
            </span>
        </div>
    );
}

export default TimerWheel;