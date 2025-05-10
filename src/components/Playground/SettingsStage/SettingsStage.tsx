import React, { JSX, useState, useCallback, useEffect, useRef, useContext } from 'react';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import {TStoreState} from '../../../store/store';
import EmptySlot from '../../GridSlot/EmptySlot';
import ConstructorComponent from '../../ConstructorComponent/ConstructorComponent';
import PauseController from '../../PauseController/PauseController';
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
    const [isEditLevelController, setIsEditLevelController] = useState<boolean>(false);

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

    const handleEditLevelController = (edit: boolean) => {
        setIsEditLevelController(edit);
    }

    return (
        <div className="Playground__inner">
            { currentSlot && <ConstructorComponent currentSlot={currentSlot as ISlot} onSelectAbility={onSelectAbility} onCancel={onConstructorCancel}/> }
            { isBinding && ReactDOM.createPortal(<div className="GeneralOverlay"></div>, document.getElementById('root') as HTMLElement) }

            <div className="Playground__box">
                <div className="Playground__boxHeader">
                    <div className={cn('Playground__button', {disabled: resetDisabled})} onClick={reset}>
                        <svg viewBox="0 0 438.529 438.528">
                            <path d="M433.109,23.694c-3.614-3.612-7.898-5.424-12.848-5.424c-4.948,0-9.226,1.812-12.847,5.424l-37.113,36.835    c-20.365-19.226-43.684-34.123-69.948-44.684C274.091,5.283,247.056,0.003,219.266,0.003c-52.344,0-98.022,15.843-137.042,47.536    C43.203,79.228,17.509,120.574,5.137,171.587v1.997c0,2.474,0.903,4.617,2.712,6.423c1.809,1.809,3.949,2.712,6.423,2.712h56.814    c4.189,0,7.042-2.19,8.566-6.565c7.993-19.032,13.035-30.166,15.131-33.403c13.322-21.698,31.023-38.734,53.103-51.106    c22.082-12.371,45.873-18.559,71.376-18.559c38.261,0,71.473,13.039,99.645,39.115l-39.406,39.397    c-3.607,3.617-5.421,7.902-5.421,12.851c0,4.948,1.813,9.231,5.421,12.847c3.621,3.617,7.905,5.424,12.854,5.424h127.906    c4.949,0,9.233-1.807,12.848-5.424c3.613-3.616,5.42-7.898,5.42-12.847V36.542C438.529,31.593,436.733,27.312,433.109,23.694z"/>
                            <path d="M422.253,255.813h-54.816c-4.188,0-7.043,2.187-8.562,6.566c-7.99,19.034-13.038,30.163-15.129,33.4    c-13.326,21.693-31.028,38.735-53.102,51.106c-22.083,12.375-45.874,18.556-71.378,18.556c-18.461,0-36.259-3.423-53.387-10.273    c-17.13-6.858-32.454-16.567-45.966-29.13l39.115-39.112c3.615-3.613,5.424-7.901,5.424-12.847c0-4.948-1.809-9.236-5.424-12.847    c-3.617-3.62-7.898-5.431-12.847-5.431H18.274c-4.952,0-9.235,1.811-12.851,5.431C1.807,264.844,0,269.132,0,274.08v127.907    c0,4.945,1.807,9.232,5.424,12.847c3.619,3.61,7.902,5.428,12.851,5.428c4.948,0,9.229-1.817,12.847-5.428l36.829-36.833    c20.367,19.41,43.542,34.355,69.523,44.823c25.981,10.472,52.866,15.701,80.653,15.701c52.155,0,97.643-15.845,136.471-47.534    c38.828-31.688,64.333-73.042,76.52-124.05c0.191-0.38,0.281-1.047,0.281-1.995c0-2.478-0.907-4.612-2.715-6.427    C426.874,256.72,424.731,255.813,422.253,255.813z"/>
                        </svg>
                    </div>

                    <CountdownEditor />

                        {/* <div className="InfoContainer__iconBox">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <path d="M26 47.875C13.9188 47.875 4.125 38.0812 4.125 26C4.125 13.9188 13.9188 4.125 26 4.125C38.0812 4.125 47.875 13.9188 47.875 26C47.875 38.0812 38.0812 47.875 26 47.875ZM26 51C39.8071 51 51 39.8071 51 26C51 12.1929 39.8071 1 26 1C12.1929 1 1 12.1929 1 26C1 39.8071 12.1929 51 26 51Z" />
                                <path d="M22.8798 35.375C22.8798 33.6491 24.2789 32.25 26.0048 32.25C27.7307 32.25 29.1298 33.6491 29.1298 35.375C29.1298 37.1009 27.7307 38.5 26.0048 38.5C24.2789 38.5 22.8798 37.1009 22.8798 35.375Z" />
                                <path d="M23.1859 16.6095C23.0195 14.9446 24.3268 13.5 26 13.5C27.6732 13.5 28.9805 14.9446 28.8141 16.6095L27.718 27.5703C27.6297 28.4529 26.887 29.125 26 29.125C25.113 29.125 24.3703 28.4529 24.282 27.5703L23.1859 16.6095Z" />
                                <path d="M23.1859 16.6095L23.6835 16.5597L23.6835 16.5597L23.1859 16.6095ZM28.8141 16.6095L28.3165 16.5597L28.3165 16.5597L28.8141 16.6095ZM27.718 27.5703L27.2205 27.5205L27.2205 27.5205L27.718 27.5703ZM24.282 27.5703L24.7795 27.5205L24.7795 27.5205L24.282 27.5703ZM47.375 26C47.375 37.8051 37.8051 47.375 26 47.375V48.375C38.3574 48.375 48.375 38.3574 48.375 26H47.375ZM26 4.625C37.8051 4.625 47.375 14.1949 47.375 26H48.375C48.375 13.6426 38.3574 3.625 26 3.625V4.625ZM4.625 26C4.625 14.1949 14.1949 4.625 26 4.625V3.625C13.6426 3.625 3.625 13.6426 3.625 26H4.625ZM26 47.375C14.1949 47.375 4.625 37.8051 4.625 26H3.625C3.625 38.3574 13.6426 48.375 26 48.375V47.375ZM50.5 26C50.5 39.531 39.531 50.5 26 50.5V51.5C40.0833 51.5 51.5 40.0833 51.5 26H50.5ZM26 1.5C39.531 1.5 50.5 12.469 50.5 26H51.5C51.5 11.9167 40.0833 0.5 26 0.5V1.5ZM1.5 26C1.5 12.469 12.469 1.5 26 1.5V0.5C11.9167 0.5 0.5 11.9167 0.5 26H1.5ZM26 50.5C12.469 50.5 1.5 39.531 1.5 26H0.5C0.5 40.0833 11.9167 51.5 26 51.5V50.5ZM23.3798 35.375C23.3798 33.9253 24.5551 32.75 26.0048 32.75V31.75C24.0028 31.75 22.3798 33.373 22.3798 35.375H23.3798ZM26.0048 32.75C27.4546 32.75 28.6298 33.9253 28.6298 35.375H29.6298C29.6298 33.373 28.0068 31.75 26.0048 31.75V32.75ZM28.6298 35.375C28.6298 36.8247 27.4546 38 26.0048 38V39C28.0068 39 29.6298 37.377 29.6298 35.375H28.6298ZM26.0048 38C24.5551 38 23.3798 36.8247 23.3798 35.375H22.3798C22.3798 37.377 24.0028 39 26.0048 39V38ZM23.6835 16.5597C23.5464 15.1892 24.6227 14 26 14V13C24.031 13 22.4925 14.7 22.6884 16.6592L23.6835 16.5597ZM26 14C27.3773 14 28.4536 15.1892 28.3165 16.5597L29.3116 16.6592C29.5075 14.7 27.969 13 26 13V14ZM28.3165 16.5597L27.2205 27.5205L28.2155 27.62L29.3116 16.6592L28.3165 16.5597ZM27.2205 27.5205C27.1578 28.1475 26.6301 28.625 26 28.625V29.625C27.1439 29.625 28.1017 28.7582 28.2155 27.62L27.2205 27.5205ZM26 28.625C25.3699 28.625 24.8422 28.1475 24.7795 27.5205L23.7845 27.62C23.8983 28.7582 24.8561 29.625 26 29.625V28.625ZM24.7795 27.5205L23.6835 16.5597L22.6884 16.6592L23.7845 27.62L24.7795 27.5205Z" />
                            </svg>
                        </div>
                        <div className="InfoContainer__textBox">
                            <span className="InfoContainer__text">
                                При параллельном отслеживании разных способностей, 
                                Приостановка и возобновление одной из способностей будет приостанавливать и возобновлять все остальные способности
                            </span>
                        </div> */}
                    {/* <PauseController appStatus={appStatus} handleClickPlay={handleClickPlay} handleClickPause={handleClickPause} disabled={playDisabled}> */}
                        {/* <div className={cn('Playground__button', {disabled: playDisabled, active: playActive})} onClick={togglePlay}>
                            <svg viewBox="0 0 163.861 163.861">
                                <path d="M34.857,3.613C20.084-4.861,8.107,2.081,8.107,19.106v125.637c0,17.042,11.977,23.975,26.75,15.509L144.67,97.275   c14.778-8.477,14.778-22.211,0-30.686L34.857,3.613z"/>
                            </svg>
                        </div> */}

                        {/* <div className={cn('appStatus', {disabled: playDisabled, active: playActive})}>
                            <svg viewBox="0 0 163.861 163.861">
                                <path d="M34.857,3.613C20.084-4.861,8.107,2.081,8.107,19.106v125.637c0,17.042,11.977,23.975,26.75,15.509L144.67,97.275   c14.778-8.477,14.778-22.211,0-30.686L34.857,3.613z"/>
                            </svg>
                        </div> */}
                    {/* </PauseController> */}

                    {
                        <div className={cn('Playground__button editToggle', {disabled: editToggleDisabled})} onClick={() => changeStage(currentStage ===  EStages.PLAY ? EStages.EDIT : EStages.PLAY)}>
                            {
                                currentStage ===  EStages.PLAY ?
                                    <svg viewBox="0 0 24 24">
                                        <path d="M22.2,14.4L21,13.7c-1.3-0.8-1.3-2.7,0-3.5l1.2-0.7c1-0.6,1.3-1.8,0.7-2.7l-1-1.7c-0.6-1-1.8-1.3-2.7-0.7   L18,5.1c-1.3,0.8-3-0.2-3-1.7V2c0-1.1-0.9-2-2-2h-2C9.9,0,9,0.9,9,2v1.3c0,1.5-1.7,2.5-3,1.7L4.8,4.4c-1-0.6-2.2-0.2-2.7,0.7   l-1,1.7C0.6,7.8,0.9,9,1.8,9.6L3,10.3C4.3,11,4.3,13,3,13.7l-1.2,0.7c-1,0.6-1.3,1.8-0.7,2.7l1,1.7c0.6,1,1.8,1.3,2.7,0.7L6,18.9   c1.3-0.8,3,0.2,3,1.7V22c0,1.1,0.9,2,2,2h2c1.1,0,2-0.9,2-2v-1.3c0-1.5,1.7-2.5,3-1.7l1.2,0.7c1,0.6,2.2,0.2,2.7-0.7l1-1.7   C23.4,16.2,23.1,15,22.2,14.4z M12,16c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4s4,1.8,4,4C16,14.2,14.2,16,12,16z"/>
                                    </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54 55" >
                                    <path d="M52.001 0C53.1055 2.5638e-05 54.0009 0.895516 54.001 2L54 53C54 54.1046 53.1046 55 52 55H33C31.8954 55 31 54.1046 31 53V49.1426C31.0001 48.0381 31.8955 47.1426 33 47.1426H46L46.001 7.85742H33C31.8955 7.85742 31.0002 6.96186 31 5.85742V2C31 0.895431 31.8954 2.0133e-08 33 0H52.001Z" />
                                    <path d="M15.1904 9.99414C15.1905 8.17693 17.4181 7.30168 18.6553 8.63281L34.9248 26.1387C35.638 26.9062 35.638 28.0938 34.9248 28.8613L18.6553 46.3672C17.4181 47.6983 15.1905 46.8231 15.1904 45.0059V33.5479H1C0.447716 33.5479 1.18768e-07 33.1001 0 32.5479V22.4521C3.88926e-06 21.8999 0.447718 21.4521 1 21.4521H15.1904V9.99414Z" />
                                </svg>
                            }
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
                                                <LevelController slot={slot} setEditController={handleEditLevelController} isEdit={isEditLevelController}/>
                                                { !isEditLevelController && !slot.customCooldown && <SpellReducer slot={slot}/> }
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