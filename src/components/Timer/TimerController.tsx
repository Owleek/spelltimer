import React, { useRef } from 'react';
import Timer from './Timer';
import './Timer.scss';

export enum ETimerStatus {
    ready = 'ready',
    running = 'running',
    stopped = 'stopped',
}

export interface ITimerHandle {
    start: () => void
    stop: () => void
    reset: () => void
}


const TimerController = () => {

    const controllers = useRef<ITimerHandle | null>(null);


    const handleClick = () => {
        if (!controllers.current) throw new Error('handleClick TimerController ref is not defined');
        controllers.current.start();
    }

    const handleDoubleClick = () => {
        if (!controllers.current) throw new Error('handleDoubleClick TimerController ref is not defined');
        controllers.current.stop();
    }

    return (
        <div className='TimerController' onClick={handleClick} onDoubleClick={handleDoubleClick}>
            <Timer cooldown={120} ref={controllers}/>
        </div>
    );
}

export default TimerController;