

import React, { JSX, useState, useCallback, useEffect, useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import {TStoreState} from '../../../store/store';
import TunedSlot from '../../GridSlot/TunedSlot';
import MainTime from '../../MainTime/MainTime';
import {ITimerData} from '../../../data/data';
import {resetState, ISlot} from '../../../store/slotSlice';
import StageContext, {EStages} from '../../../store/StageContext';
import '../SettingsStage/SettingsStage';
import './TimersStage';

const TimersStage = (): JSX.Element => {
    const slotList = useSelector((state: TStoreState) => state.slotList, (prev, next) => JSON.stringify(prev) === JSON.stringify(next));
    const dispatch = useDispatch();
    const context = useContext(StageContext);
    const slotListRef = useRef<ISlot[]>(slotList);
    const isTimeRuns = false;

    useEffect(() => { slotListRef.current = slotList }, [slotList]);

    const setUp = () => {
        if (!context) return;
        context.changeStage(EStages.SETTINGS);
    }

    return (
        <div className="SettingsStage">
            {/* <div className={cn('ToolBox', {success: false})} onClick={setUp}>
                <span className="ToolBox__icon">
                    <span className='ToolBox__save'>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 72 72">
                            <path d="M57.658,12.643c1.854,1.201,2.384,3.678,1.183,5.532l-25.915,40c-0.682,1.051-1.815,1.723-3.064,1.814	C29.764,59.997,29.665,60,29.568,60c-1.146,0-2.241-0.491-3.003-1.358L13.514,43.807c-1.459-1.659-1.298-4.186,0.36-5.646	c1.662-1.46,4.188-1.296,5.646,0.361l9.563,10.87l23.043-35.567C53.329,11.971,55.806,11.442,57.658,12.643z"></path>
                        </svg>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 72 72">
                        <path d="M57.531,30.556C58.96,30.813,60,32.057,60,33.509v4.983c0,1.452-1.04,2.696-2.469,2.953l-2.974,0.535	c-0.325,1.009-0.737,1.977-1.214,2.907l1.73,2.49c0.829,1.192,0.685,2.807-0.342,3.834l-3.523,3.523	c-1.027,1.027-2.642,1.171-3.834,0.342l-2.49-1.731c-0.93,0.477-1.898,0.889-2.906,1.214l-0.535,2.974	C41.187,58.96,39.943,60,38.491,60h-4.983c-1.452,0-2.696-1.04-2.953-2.469l-0.535-2.974c-1.009-0.325-1.977-0.736-2.906-1.214	l-2.49,1.731c-1.192,0.829-2.807,0.685-3.834-0.342l-3.523-3.523c-1.027-1.027-1.171-2.641-0.342-3.834l1.73-2.49	c-0.477-0.93-0.889-1.898-1.214-2.907l-2.974-0.535C13.04,41.187,12,39.943,12,38.491v-4.983c0-1.452,1.04-2.696,2.469-2.953	l2.974-0.535c0.325-1.009,0.737-1.977,1.214-2.907l-1.73-2.49c-0.829-1.192-0.685-2.807,0.342-3.834l3.523-3.523	c1.027-1.027,2.642-1.171,3.834-0.342l2.49,1.731c0.93-0.477,1.898-0.889,2.906-1.214l0.535-2.974C30.813,13.04,32.057,12,33.509,12	h4.983c1.452,0,2.696,1.04,2.953,2.469l0.535,2.974c1.009,0.325,1.977,0.736,2.906,1.214l2.49-1.731	c1.192-0.829,2.807-0.685,3.834,0.342l3.523,3.523c1.027,1.027,1.171,2.641,0.342,3.834l-1.73,2.49	c0.477,0.93,0.889,1.898,1.214,2.907L57.531,30.556z M36,45c4.97,0,9-4.029,9-9c0-4.971-4.03-9-9-9s-9,4.029-9,9	C27,40.971,31.03,45,36,45z"></path>
                    </svg>
                </span>
            </div> */}

            <div className="SettingsStage__header">
                <MainTime isRun={false} seconds="00" minutes="00" onClickSettings={() => null} onClickTrigger={() => null}/>                
            </div>

            <div className="SettingsStage__grid">
                {
                    slotList.map(slot => {
                        return 'name' in slot 
                        ? <TunedSlot key={slot.position} data={slot} handleRemove={() => null}/>
                        : <div></div>
                    })
                }
            </div>
        </div>
    )
}

export default TimersStage;