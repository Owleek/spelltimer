// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { JSX, useEffect, useRef, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import StageContext, {EStages} from '../../store/StageContext';
import { ITimerData, IRequiredFields } from '../../data/data';
import { EAppStatus } from '../Playground/SettingsStage/SettingsStage';
import {setActiveLevelIndex, setCustomCooldown, clearReducer} from '../../store/slotSlice';
import {toSafeInteger, translateText} from '../../utils/utils';
import {TStoreState} from '../../store/store';
import { addTyping, removeTyping } from '../../store/typingSlice';
import './LevelController.scss';

interface IProps {
    slot: IRequiredFields
    editLevelController: (position: number) => void
    cancelEditLevelController: (position: number) => void
    isEdit: boolean
}

const LevelController = ({slot, isEdit, editLevelController, cancelEditLevelController}: IProps): JSX.Element => {
    const TYPING_ID = slot.position + 'customCooldown';
    const {cooldown: levels, cooldownIndex: activeLevelIndex, customCooldown} = slot;
    const initialCustomValue = customCooldown || levels[levels.length - 1];
    const [pressedIndicator, setPressedIndicator] = useState<number | null>(null);

    const [customValue, setCustomValue] = useState<number | ''>(initialCustomValue);

    const {dictionary} = useSelector((state: TStoreState) => state.localeSlice);

    const dispatch = useDispatch();

    const handeMouseOver = (event: any) => {
        const children = event.target.parentNode.children;
        const currentElementIndex = Array.prototype.findIndex.call(children, el => el === event.target);

        Array.prototype.forEach.call(children, (el, currIdx) => {
            if (currIdx <= currentElementIndex) return el.classList.add('active');
            if (el.classList.contains('active')) el.classList.remove('active');
        });
    }

    const handeMouseLeave = (event: any) => {
        const children = event.target.parentNode.children;

        Array.prototype.forEach.call(children, (el, currIdx) => {
            if (currIdx <= activeLevelIndex) return el.classList.add('active');
            if (el.classList.contains('active')) el.classList.remove('active');
        });

        setPressedIndicator(null);
    }

    const hadnleMouseDown = (index: number) => {
        setPressedIndicator(index);
    }

    const hadnleMouseUp = (index: number) => {
        dispatch(setActiveLevelIndex({position: slot.position, activeLevelIndex: index}));
        setPressedIndicator(null);
    }
   
    const handleSave = () => {
        const number = +customValue;
        cancelEditLevelController(slot.position);
        dispatch(setCustomCooldown({position: slot.position, customCooldown: number}));
        dispatch(clearReducer({position: slot.position}));
    }

    const handleRemove = () => {
        cancelEditLevelController(slot.position);
        dispatch(setCustomCooldown({position: slot.position, customCooldown: null}));
    }

    const handeChangeCustomValue = (event: any) => {
        const value = event.target.value.trim();
        if (value === '') return setCustomValue('');
        const number = toSafeInteger(value);
        if (number === null) return setCustomValue(customValue);
        setCustomValue(number);
    }

    const handleKeyUp = (evt: React.KeyboardEvent) => {
        if (evt.code === 'Escape') return handleRemove();
        if (evt.code === 'Enter' && !!customValue) return handleSave();
    }

    const handleFocus = (e: any) => {
        dispatch(addTyping({value: TYPING_ID}));
    }

    const handleBlur = (e: any) => {
        dispatch(removeTyping({value: TYPING_ID}));
    }

   return (
        <div className="LevelController appStyledScroll">
            {
                isEdit ?
                   <React.Fragment>
                        <span className={cn('LevelController__btn save', {disabled: !customValue})} onClick={handleSave}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 703 620">
                                <path d="M579.527 28.1496C600.434 -1.70911 641.589 -8.9657 671.447 11.9416L673.904 13.6623C703.763 34.5696 711.02 75.7235 690.112 105.582L349.856 591.519C334.496 613.455 308.208 623.192 283.499 618.525C274.347 616.892 265.394 613.29 257.278 607.607L28.1496 447.169C-1.7091 426.262 -8.9657 385.108 11.9416 355.249L13.6623 352.792C34.5696 322.933 75.7235 315.677 105.582 336.584L278.687 457.793L579.527 28.1496Z"/>
                            </svg>
                        </span>
                        <div className="LevelController__customisation">
                            <div className="LevelController__customTimeContainer">
                                <div className="LevelController__inputBox">
                                    <input autoFocus={true} 
                                           type="text" 
                                           className="LevelController__input" 
                                           value={customValue} 
                                           onChange={handeChangeCustomValue} 
                                           onKeyUp={handleKeyUp}
                                           onFocus={handleFocus}
                                           onBlur={handleBlur}/>
                                </div>
                                <span className="LevelController__customTimeText">{translateText(dictionary, 'sec')}</span>
                            </div>
                            <span className={cn('LevelController__btn remove')} onClick={handleRemove}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
                                    <path d="M43.7147 1.4392C44.8865 2.61075 44.8866 4.51047 43.7149 5.68212L29.0215 20.3748C27.8498 21.5464 27.8498 23.4459 29.0214 24.6175L43.7152 39.3113C44.8868 40.4829 44.8868 42.3824 43.7152 43.554L43.454 43.8152C42.2824 44.9868 40.3829 44.9868 39.2113 43.8152L24.5175 29.1214C23.3459 27.9498 21.4464 27.9498 20.2748 29.1215L5.58212 43.8149C4.41047 44.9866 2.51076 44.9865 1.3392 43.8147L1.07845 43.5539C-0.0928846 42.3823 -0.092807 40.483 1.07862 39.3116L15.772 24.6174C16.9435 23.4459 16.9435 21.5464 15.7719 20.3749L1.07896 5.68189C-0.0926111 4.51032 -0.0926088 2.61083 1.07896 1.43925L1.33925 1.17896C2.51083 0.00739199 4.41032 0.00739157 5.58189 1.17896L20.2749 15.8719C21.4464 17.0435 23.3459 17.0435 24.5174 15.872L39.2116 1.17862C40.383 0.00719345 42.2823 0.00711489 43.4539 1.17845L43.7147 1.4392Z" />
                                </svg>
                            </span>
                        </div>
                   </React.Fragment>
                :
                    <div className="LevelController__holder">
                        <span className={cn('LevelController__btn edit')} onClick={() => editLevelController(slot.position)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" >
                                <path d="M19.0822 18.8828H1.4375C1.25724 18.8828 1.08435 18.9544 0.956888 19.0819C0.829422 19.2094 0.757813 19.3822 0.757812 19.5625C0.757813 19.7428 0.829422 19.9156 0.956888 20.0431C1.08435 20.1706 1.25724 20.2422 1.4375 20.2422H19.0822C19.2625 20.2422 19.4353 20.1706 19.5628 20.0431C19.6903 19.9156 19.7619 19.7428 19.7619 19.5625C19.7619 19.3822 19.6903 19.2094 19.5628 19.0819C19.4353 18.9544 19.2625 18.8828 19.0822 18.8828Z" />
                                <path d="M19.4175 1.60969C18.1352 0.327344 15.8469 0.526719 14.3153 2.06281L5.17125 11.2023C5.08624 11.2859 5.02521 11.3908 4.99453 11.5059L3.63516 16.5628C3.60631 16.6778 3.60784 16.7983 3.6396 16.9126C3.67136 17.0268 3.73225 17.1308 3.81632 17.2144C3.90038 17.298 4.00473 17.3584 4.11913 17.3895C4.23354 17.4206 4.35406 17.4215 4.46891 17.392L9.52125 16.0327C9.63656 16.0048 9.74174 15.9451 9.82484 15.8605L18.9689 6.70734C20.3555 5.38422 20.8086 2.97813 19.4175 1.60969ZM8.99562 14.7503L5.25281 15.7608L6.26328 12.0225L13.5133 4.7725L16.232 7.49125L8.99562 14.7503ZM18.8919 3.99312C18.8511 4.98094 17.9086 5.87813 17.2062 6.54875L14.4875 3.83L15.285 3.02797C16.6942 1.53719 19.1094 1.91781 18.8919 3.99312Z" />
                            </svg>
                        </span>
                        {
                            customCooldown ?
                                <div className="LevelController__customisation">
                                    <div className="LevelController__customTimeContainer">
                                        <span className="LevelController__customTimeNumber">{customCooldown}</span>
                                        <span className="LevelController__customTimeText">sec</span>
                                    </div>
                                </div>
                            :
                                <div className="LevelController__indicatorsContainer">
                                    {
                                        levels.map((level, index) => 
                                            <div key={level} className={cn('LevelController__indicatorBox', {active: index <= activeLevelIndex, pressed: pressedIndicator === index})} 
                                                    title={String(level)} 
                                                    onMouseOver={(event) => handeMouseOver(event)} 
                                                    onMouseLeave={(event) => handeMouseLeave(event)}
                                                    onMouseDown={() => hadnleMouseDown(index)}
                                                    onMouseUp={() => hadnleMouseUp(index)}>
                                                <span className="LevelController__indicator"></span>
                                            </div>
                                        )
                                    }
                                </div>
                        }
                    </div>
            }
        </div>
   )
}

export default LevelController;