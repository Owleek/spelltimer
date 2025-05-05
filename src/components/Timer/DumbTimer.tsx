// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.

import React, { JSX, useEffect, useRef, useState, useContext } from 'react';
import cn from 'classnames';
import TickNotifier, {COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND} from '../../utils/TickNotifier';
// import { IDataItem, ISpells, IArtifacts, TMixedDataItem } from '../../data/data';
import StageContext, {EStages} from '../../store/StageContext';
import { ITimerData } from '../../data/data';
import { EAppStatus } from '../Playground/SettingsStage/SettingsStage';
import fetchData from '../../data/data';
import './Timer.scss';

interface IProps {
    ability: ITimerData
    appStatus: EAppStatus
    runApp: () => any
    pauseApp: () => any
}

enum ETimerStatus {
    ready = 'ready',
    running = 'running',
    paused = 'paused'
}

const DumbTimer = ({ability, appStatus, runApp, pauseApp}: IProps): JSX.Element => {
    if (!ability) return <div></div>;

    const {currentStage, changeStage} = useContext(StageContext);

    const [cooldown, setCooldown] = useState<number>(ability.cooldown[0]);
    const [timerStatus, setTimerStatus] = useState<ETimerStatus>(ETimerStatus.ready);

    const countMSRef = useRef<number>(0);
    const cooldownRef = useRef<number>(ability.cooldown[0]);
    const timerStatusRef = useRef<ETimerStatus>(ETimerStatus.ready);

    const circleRef = useRef<SVGCircleElement | null>(null);
    const strokeDashoffsetRef = useRef<number>(0);

    const strokeWidth = 70;
    const radius = 35;
    const length = 2 * Math.PI * radius;
    const step = length / (COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND * ability.cooldown[0]);

    const{ heroes } = fetchData;
    const currentHero = ability.owner ? heroes.find(hero => hero.name === ability.owner) : null;

    useEffect(() => {
        const instance = TickNotifier.getInstance();
        instance.subscribe(onTickNotify);
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            instance.unsubscribe(onTickNotify);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, []);

    useEffect(() => {

        if ((appStatus === EAppStatus.PAUSED) && timerStatusRef.current === ETimerStatus.running) {
            timerStatusRef.current = ETimerStatus.paused;
        }

        if ((appStatus === EAppStatus.RUNNING) && timerStatusRef.current === ETimerStatus.paused) {
            timerStatusRef.current = ETimerStatus.running;
        }

    }, [appStatus]);

    const onTickNotify = () => {
        const _countMS = countMSRef.current;
        const _cooldown = cooldownRef.current;
        const _timerStatus = timerStatusRef.current;
        const _circle = circleRef.current;
        const _strokeDashoffset = strokeDashoffsetRef.current;

        if (_cooldown === 0 || _timerStatus !== ETimerStatus.running || !_circle) return;

        if (_countMS === COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND) {
            countMSRef.current = 0;
            cooldownRef.current -= 1;
            return cooldownRef.current === 0 ? refreshTimer() : setCooldown(cooldownRef.current);
        }

        countMSRef.current += 1;
        strokeDashoffsetRef.current += _strokeDashoffset + step < length ? step : length - _strokeDashoffset;
        _circle.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;
    }

    const onVisibilityChange = () => {
        if (!circleRef.current) return;

        if (document.hidden) {
            return circleRef.current.classList.remove('transition');
        }

        const timeoutID = setTimeout(() => {
            if (!circleRef.current) return;
            circleRef.current.classList.add('transition');
            clearTimeout(timeoutID);
        }, 10);
    }

    const refreshTimer = () => {
        if (!circleRef.current) return;

        timerStatusRef.current = ETimerStatus.ready;
        cooldownRef.current = ability.cooldown[0];
        setCooldown(cooldownRef.current);
        setTimerStatus(timerStatusRef.current);

        const timeOutId = setTimeout(() => {
            if (!circleRef.current) return;

            circleRef.current.style.display = 'none';
            strokeDashoffsetRef.current = 0;
            circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;
            clearTimeout(timeOutId);
        }, 10);
    }

    const handleClickTimer = () => {
        if ((timerStatusRef.current === ETimerStatus.ready) && circleRef.current) {
            circleRef.current.style.display = 'block';
        }

        if (timerStatusRef.current === ETimerStatus.running) {
            timerStatusRef.current = ETimerStatus.paused;
            pauseApp();
            return setTimerStatus(timerStatusRef.current);
        }

        timerStatusRef.current = ETimerStatus.running;
        setTimerStatus(timerStatusRef.current);
        runApp();
    }

    return <div className="Timer" style={{backgroundImage: `url('${ability.img}')`}}>
                {        
                    currentHero && 
                        <div className="Timer__ownerBox">
                            <img className="Timer__ownerImg" src={currentHero.img}/>
                            <span className="Timer__ownerName">{currentHero.name}</span>
                        </div> 
                }
                <div className="Timer__innerWrapper Playground__slotEasyShadow">
                    <svg className="Timer__svg" viewBox="0 0 120 120">
                        <circle
                            ref={circleRef}
                            className={cn('Timer__circle transition')}
                            cx="60"
                            cy="60"
                            strokeWidth={strokeWidth}
                            r={radius}
                            fill="transparent"
                            strokeDasharray={length}
                            strokeDashoffset={strokeDashoffsetRef.current}
                            transform="rotate(-90 60 60)"/>
                    </svg>

                    {
                        timerStatus !== ETimerStatus.ready &&
                        <div className="Timer__countdown">{cooldown}</div>
                    }

                    {
                        currentStage === EStages.PLAY &&
                        <div className="Timer__cover" onClick={handleClickTimer}>
                            {
                                (timerStatus === ETimerStatus.ready) &&
                                <div className="Timer__play">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 30">
                                        <path d="M24.9 12.1623C26.9 13.317 26.9 16.2038 24.9 17.3585L4.5594 29.1021C2.5594 30.2568 0.0594025 28.8134 0.0594025 26.504V3.01675C0.0594025 0.707349 2.5594 -0.736029 4.5594 0.418672L24.9 12.1623Z"/>
                                    </svg>
                                </div>
                            }
                        </div>
                    }
                </div>
    </div>
}

export default DumbTimer;