import React, { useRef } from 'react';
import Timer from './Timer';
import TimerWheel from '../TimerWheel/TimerWheel';
import { translate, createArrayFromNumber } from '../../utils/utils';
import './TimerController.scss';

const reducers = [
    {
        id: 1,
        key: 'octarine_core',
        name: translate('octarine_core'),
        img: '/assets/items/octarine_core.png'
    },
    {
        id: 2,
        key: 'feverish',
        name: translate('feverish'),
        img: '/assets/items/feverish.png'
    }
];

export enum ETimerStatus {
    ready = 'ready',
    running = 'running',
    stopped = 'stopped'
}

export interface ITimerHandle {
    start: () => void
    stop: () => void
    reset: () => void
}

const TimerController = () => {

    const timerMethodsRef = useRef<ITimerHandle | null>(null);

    const handleClick = () => {
        // if (!timerMethodsRef.current) throw new Error('handleClick TimerController ref is not defined');
        // timerMethodsRef.current.start();
    }

    const handleDoubleClick = () => {
        // if (!timerMethodsRef.current) throw new Error('handleDoubleClick TimerController ref is not defined');
        // timerMethodsRef.current.stop();
    }

    return (
        <div className="TimerController" onClick={handleClick} onDoubleClick={handleDoubleClick}>
            <ul className="ReducerList">
                <li className="ReducerItem" onClick={() => null} title={reducers[0].name}>
                    <span className="ReducerItem__text">-25%</span>
                    <img alt={reducers[0].name} src={reducers[0].img}/></li>
                <li className="ReducerItem active" onClick={() => null} title={reducers[1].name}>
                    <span className="ReducerItem__text">-15%</span>
                    <img alt={reducers[1].name} src={reducers[1].img}/></li>
            </ul>
            <Timer cooldown={120} ref={timerMethodsRef}/>
            <span className="TimerController__control reset">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="reload">
                    <path d="M12 4a8 8 0 0 1 4.985 1.758H15.242a1 1 0 0 0 0 2h4a1 1 0 0 0 1-1v-4a1 1 0 1 0-2 0V4.206A9.983 9.983 0 0 0 2 12a1 1 0 0 0 2 0A8.009 8.009 0 0 1 12 4zM21 11a1 1 0 0 0-1 1A7.986 7.986 0 0 1 7.015 18.242H8.757a1 1 0 1 0 0-2h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V19.794A9.984 9.984 0 0 0 22 12 1 1 0 0 0 21 11z"></path>
                </svg>
            </span>
            <div className="TimerController__levelContainer">
                <span className="TimerController__levelControl">-</span>
                <div className="TimerController__levelSets">
                    <div className="TimerController__customCooldown">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
                            <path d="M57.531,30.556C58.96,30.813,60,32.057,60,33.509v4.983c0,1.452-1.04,2.696-2.469,2.953l-2.974,0.535	c-0.325,1.009-0.737,1.977-1.214,2.907l1.73,2.49c0.829,1.192,0.685,2.807-0.342,3.834l-3.523,3.523	c-1.027,1.027-2.642,1.171-3.834,0.342l-2.49-1.731c-0.93,0.477-1.898,0.889-2.906,1.214l-0.535,2.974	C41.187,58.96,39.943,60,38.491,60h-4.983c-1.452,0-2.696-1.04-2.953-2.469l-0.535-2.974c-1.009-0.325-1.977-0.736-2.906-1.214	l-2.49,1.731c-1.192,0.829-2.807,0.685-3.834-0.342l-3.523-3.523c-1.027-1.027-1.171-2.641-0.342-3.834l1.73-2.49	c-0.477-0.93-0.889-1.898-1.214-2.907l-2.974-0.535C13.04,41.187,12,39.943,12,38.491v-4.983c0-1.452,1.04-2.696,2.469-2.953	l2.974-0.535c0.325-1.009,0.737-1.977,1.214-2.907l-1.73-2.49c-0.829-1.192-0.685-2.807,0.342-3.834l3.523-3.523	c1.027-1.027,2.642-1.171,3.834-0.342l2.49,1.731c0.93-0.477,1.898-0.889,2.906-1.214l0.535-2.974C30.813,13.04,32.057,12,33.509,12	h4.983c1.452,0,2.696,1.04,2.953,2.469l0.535,2.974c1.009,0.325,1.977,0.736,2.906,1.214l2.49-1.731	c1.192-0.829,2.807-0.685,3.834,0.342l3.523,3.523c1.027,1.027,1.171,2.641,0.342,3.834l-1.73,2.49	c0.477,0.93,0.889,1.898,1.214,2.907L57.531,30.556z M36,45c4.97,0,9-4.029,9-9c0-4.971-4.03-9-9-9s-9,4.029-9,9	C27,40.971,31.03,45,36,45z"></path>
                        </svg>
                    </div>
                    <div className="TimerController__indicatorsContainer">
                        <i className="TimerController__indicator active"></i>
                        <i className="TimerController__indicator"></i>
                        <i className="TimerController__indicator"></i>
                        <i className="TimerController__indicator"></i>
                    </div>
                </div>
                <span className="TimerController__levelControl">+</span>
            </div>
            <TimerWheel numbers={createArrayFromNumber(120)} currentValue={90} onChange={(value) => console.log(value)}/>
        </div>
    );
}

export default TimerController;