import React, { JSX, useState, useCallback, useEffect, useRef, useContext } from 'react';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import {TStoreState} from '../../../store/store';
import EmptySlot from '../../GridSlot/EmptySlot';
import ConstructorComponent from '../../ConstructorComponent/ConstructorComponent';
import {EAbility, ITimerData} from '../../../data/data';
import {removeTimerFromSlot, mapSpellToSlot, mapItemToSlot, mapFeatureToSlot, resetState, ISlot} from '../../../store/slotSlice';
import {setHotkey} from '../../../store/hotkeySlice';
import StageContext, {EStages} from '../../../store/StageContext';
import { translate } from '../../../utils/utils';
import { getKeyFromCode } from '../../../data/keyCodeDictionary';
import DumbTimer from '../../Timer/DumbTimer';
import LevelController from '../../LevelController/LevelController';
import LevelControllerView from '../../LevelController/LevelControllerView';
import SpellReducer from '../../SpellReducer/SpellReducer';
import './SettingsStage.scss';
import CountdownEditor from '../../CoundownEditor/CountdownEditor';

export enum EAppStatus {
    RUNNING = 'runnig',
    PAUSED = 'paused',
    INITIAL = 'initial'
}

const SettingsStage = (): JSX.Element => {
    // TODO - нужно сделать нормальную функцию сравнения или по другому использовать стейт
    const slotList = useSelector((state: TStoreState) => state.slotList, (prev, next) => JSON.stringify(prev) === JSON.stringify(next));
    const runningSlots = useSelector((state: TStoreState) => state.runningSlice);

    const [currentSlot, setCurrnetSlot] = useState<ISlot | null>(null);
    const {currentStage, changeStage} = useContext(StageContext);
    const [isBinding, setIsBinding] = useState<boolean>(false);
    const [appStatus, setAppStatus] = useState<EAppStatus>(EAppStatus.INITIAL);
    const [editLevelControllers, setIsEditLevelController] = useState<number[]>([]);

    const pauseActive = appStatus === EAppStatus.PAUSED;

    const [isEdit, setIsEdit] = useState<boolean>(slotList.some(slot => 'name' in slot));

    const resetDisabled = currentStage !== EStages.EDIT;
    const editToggleDisabled = currentStage === EStages.INITIAL;
    const playDisabled = currentStage === EStages.INITIAL || !runningSlots.running.length;
    const playActive = appStatus === EAppStatus.RUNNING;

    const dispatch = useDispatch();
    const context = useContext(StageContext);
    const slotListRef = useRef<ISlot[]>(slotList);
    const editingSlot = useRef<ISlot | null>(null);
    const appStatusRef = useRef<EAppStatus>(appStatus);

    useEffect(() => { 
        slotListRef.current = slotList;
        const currentIsEdit = slotList.some(slot => 'name' in slot);
        if (isEdit !== currentIsEdit) setIsEdit(currentIsEdit);
     }, [slotList]);

    const removeTimer = useCallback((slot: ITimerData) => {
        const settedUpSlots = slotList.filter(slot => 'name' in slot);

        if (settedUpSlots.length === 1) {
            setAppStatus(EAppStatus.INITIAL);
            changeStage(EStages.INITIAL);
        }

        dispatch(removeTimerFromSlot(slot));
    }, [slotList]);

    useEffect(() => {
        appStatusRef.current = appStatus;
    }, [appStatus]);

    const handleClickEmptySlot = (slot: ISlot) => setCurrnetSlot(slot);

    const onSelectAbility = (ability: ITimerData) => {
        if(!currentSlot) return;
        if (currentStage !== EStages.EDIT) changeStage(EStages.EDIT);

        const updData = {
            ...ability,
            position: currentSlot.position,
            boundKey: currentSlot.boundKey
        }

        setCurrnetSlot(null);
        if (ability.type === EAbility.SPELLS) return dispatch(mapSpellToSlot(updData));
        if ('owner' in ability) return dispatch(mapItemToSlot(updData));
        dispatch(mapFeatureToSlot(updData));
    };

    const onConstructorCancel = () => setCurrnetSlot(null);

    const reset = () => {
        dispatch(resetState(null));
        changeStage(EStages.INITIAL);
        setAppStatus(EAppStatus.INITIAL);
    }

    const getKey = useCallback((event: KeyboardEvent) => {
        const keyIs = event.code;
        setIsBinding(false);
        document.removeEventListener('keydown', getKey);

        if (!editingSlot.current || keyIs === 'Escape') return;

        dispatch(setHotkey({key: keyIs, id: editingSlot.current.position, type: 'slot'}));
        editingSlot.current = null;
    }, []);

    const handleBindKey = (slot: ISlot) => {
        setIsBinding(true);
        editingSlot.current = slot;
        document.addEventListener('keydown', getKey);
    }

    const handleClickPause = useCallback(() => {
        if (appStatusRef.current !== EAppStatus.PAUSED) return setAppStatus(EAppStatus.PAUSED);
    }, []);
    
    const handleClickPlay = useCallback(() => {
        if (appStatusRef.current !== EAppStatus.RUNNING) return setAppStatus(EAppStatus.RUNNING);
    }, []);

    const togglePlay = useCallback(() => {
        setAppStatus(appStatusRef.current === EAppStatus.RUNNING ? EAppStatus.PAUSED : EAppStatus.RUNNING);
    }, []);

    const editLevelController = (position: number) => {
        const upd = editLevelControllers.slice().filter(item => item !== position);
        upd.push(position);
        setIsEditLevelController(upd);
    }

    const cancelEditLevelController = (position: number) => {
        const upd = editLevelControllers.slice().filter(item => item !== position);
        setIsEditLevelController(upd);
    }

    return (
        <div className="Playground__inner">
            { currentSlot && <ConstructorComponent currentSlot={currentSlot as ISlot} onSelectAbility={onSelectAbility} onCancel={onConstructorCancel}/> }
            { isBinding && ReactDOM.createPortal(<div className="GeneralOverlay"></div>, document.getElementById('root') as HTMLElement) }

            <div className="Playground__box">
                <div className="Playground__boxHeader">
                    {
                        currentStage === EStages.EDIT &&
                        <React.Fragment>
                            <div className={cn('Playground__button')} onClick={reset}>
                                <svg viewBox="0 0 438.529 438.528">
                                    <path d="M433.109,23.694c-3.614-3.612-7.898-5.424-12.848-5.424c-4.948,0-9.226,1.812-12.847,5.424l-37.113,36.835    c-20.365-19.226-43.684-34.123-69.948-44.684C274.091,5.283,247.056,0.003,219.266,0.003c-52.344,0-98.022,15.843-137.042,47.536    C43.203,79.228,17.509,120.574,5.137,171.587v1.997c0,2.474,0.903,4.617,2.712,6.423c1.809,1.809,3.949,2.712,6.423,2.712h56.814    c4.189,0,7.042-2.19,8.566-6.565c7.993-19.032,13.035-30.166,15.131-33.403c13.322-21.698,31.023-38.734,53.103-51.106    c22.082-12.371,45.873-18.559,71.376-18.559c38.261,0,71.473,13.039,99.645,39.115l-39.406,39.397    c-3.607,3.617-5.421,7.902-5.421,12.851c0,4.948,1.813,9.231,5.421,12.847c3.621,3.617,7.905,5.424,12.854,5.424h127.906    c4.949,0,9.233-1.807,12.848-5.424c3.613-3.616,5.42-7.898,5.42-12.847V36.542C438.529,31.593,436.733,27.312,433.109,23.694z"/>
                                    <path d="M422.253,255.813h-54.816c-4.188,0-7.043,2.187-8.562,6.566c-7.99,19.034-13.038,30.163-15.129,33.4    c-13.326,21.693-31.028,38.735-53.102,51.106c-22.083,12.375-45.874,18.556-71.378,18.556c-18.461,0-36.259-3.423-53.387-10.273    c-17.13-6.858-32.454-16.567-45.966-29.13l39.115-39.112c3.615-3.613,5.424-7.901,5.424-12.847c0-4.948-1.809-9.236-5.424-12.847    c-3.617-3.62-7.898-5.431-12.847-5.431H18.274c-4.952,0-9.235,1.811-12.851,5.431C1.807,264.844,0,269.132,0,274.08v127.907    c0,4.945,1.807,9.232,5.424,12.847c3.619,3.61,7.902,5.428,12.851,5.428c4.948,0,9.229-1.817,12.847-5.428l36.829-36.833    c20.367,19.41,43.542,34.355,69.523,44.823c25.981,10.472,52.866,15.701,80.653,15.701c52.155,0,97.643-15.845,136.471-47.534    c38.828-31.688,64.333-73.042,76.52-124.05c0.191-0.38,0.281-1.047,0.281-1.995c0-2.478-0.907-4.612-2.715-6.427    C426.874,256.72,424.731,255.813,422.253,255.813z"/>
                                </svg>
                            </div>
                            <CountdownEditor />
                            <div className={cn('Playground__button play')} onClick={() => changeStage(EStages.PLAY)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 26" >
                                    <path d="M23 0C23.5523 0 24 0.447715 24 1V25C24 25.5523 23.5523 26 23 26H12C11.4477 26 11 25.5523 11 25V23C11 22.4477 11.4477 22 12 22H20V4H12C11.4477 4 11 3.55228 11 3V1C11 0.447715 11.4477 2.0133e-08 12 0H23Z" />
                                    <path d="M0.5 5.20605C0.5 4.43625 1.33333 3.95494 2 4.33984L15.5 12.1338C16.1667 12.5187 16.1667 13.4813 15.5 13.8662L2 21.6602C1.33333 22.0451 0.5 21.5637 0.5 20.7939V5.20605Z" />
                                </svg>
                            </div>
                        </React.Fragment>
                    }
                    {
                        currentStage ===  EStages.PLAY && 
                        <div className={cn('Playground__button edit')} onClick={() => changeStage(EStages.EDIT)}>
                            <svg viewBox="0 0 24 24">
                                <path d="M22.2,14.4L21,13.7c-1.3-0.8-1.3-2.7,0-3.5l1.2-0.7c1-0.6,1.3-1.8,0.7-2.7l-1-1.7c-0.6-1-1.8-1.3-2.7-0.7   L18,5.1c-1.3,0.8-3-0.2-3-1.7V2c0-1.1-0.9-2-2-2h-2C9.9,0,9,0.9,9,2v1.3c0,1.5-1.7,2.5-3,1.7L4.8,4.4c-1-0.6-2.2-0.2-2.7,0.7   l-1,1.7C0.6,7.8,0.9,9,1.8,9.6L3,10.3C4.3,11,4.3,13,3,13.7l-1.2,0.7c-1,0.6-1.3,1.8-0.7,2.7l1,1.7c0.6,1,1.8,1.3,2.7,0.7L6,18.9   c1.3-0.8,3,0.2,3,1.7V22c0,1.1,0.9,2,2,2h2c1.1,0,2-0.9,2-2v-1.3c0-1.5,1.7-2.5,3-1.7l1.2,0.7c1,0.6,2.2,0.2,2.7-0.7l1-1.7   C23.4,16.2,23.1,15,22.2,14.4z M12,16c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4s4,1.8,4,4C16,14.2,14.2,16,12,16z"/>
                            </svg>
                        </div>
                    }
                </div>
                <div className={cn('Playground__boxBody')}>
                    {
                        slotList.map(slot => {
                        return  <div key={slot.position} className={cn('Playground__slotBox', {void: currentStage === EStages.PLAY})}>
                                    {
                                        !('name' in slot)
                                        ? <EmptySlot key={slot.position} data={slot} onClick={handleClickEmptySlot} className='Playground__slotEasyShadow'/> 
                                        : <React.Fragment>
                                            <DumbTimer ability={slot} 
                                                        appStatus={appStatus} 
                                                        runApp={handleClickPlay} 
                                                        pauseApp={handleClickPause}
                                                        currentStage={currentStage}
                                                        removeTimer={removeTimer}
                                                        isBinding={isBinding}/>
                                        {
                                            currentStage === EStages.EDIT ?
                                            <div className="Playground__slotSettings">
                                                <LevelController slot={slot}
                                                                 editLevelController={editLevelController}
                                                                 cancelEditLevelController={cancelEditLevelController}
                                                                 isEdit={editLevelControllers.includes(slot.position)} />
                                                { !editLevelControllers.includes(slot.position) && !slot.customCooldown && <SpellReducer slot={slot}/> }
                                            </div>
                                            : <React.Fragment>
                                                <LevelControllerView slot={slot}/>
                                                { !slot.customCooldown && <SpellReducer slot={slot} view={true}/> }
                                            </React.Fragment>
                                        }
                                        </React.Fragment>
                                    }
                                    {
                                        currentStage === EStages.EDIT && 
                                        <div className={cn('Playground__slotHotkey', {isBinding: editingSlot.current === slot && isBinding})} onClick={() => handleBindKey(slot)}>
                                            <div className='Playground__slotHotKeyTextBox'>
                                                <span className="Playground__slotHotKeyText">
                                                    {
                                                        editingSlot.current === slot && isBinding 
                                                            ? translate('Press any key to bind') 
                                                            : getKeyFromCode(slot.boundKey)
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    }
                                </div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default SettingsStage;