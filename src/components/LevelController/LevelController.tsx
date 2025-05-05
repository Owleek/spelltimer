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
import {removeTimerFromSlot, mapSpellToSlot, mapItemToSlot, mapFeatureToSlot, resetState, ISlot, setActiveLevelIndex, setCustomCooldown} from '../../store/slotSlice';
import {toSafeInteger} from '../../utils/utils';
import './LevelController.scss';

interface IProps {
    slot: IRequiredFields
}

const LevelControllerView = ({slot}: IProps): JSX.Element => {
    const {cooldown: levels, cooldownIndex: activeLevelIndex, customCooldown} = slot;
    const initialCustomValue = customCooldown || levels[levels.length - 1];
    const [pressedIndicator, setPressedIndicator] = useState<number | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const [customValue, setCustomValue] = useState<number | ''>(initialCustomValue);

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
        setIsEdit(false);
        dispatch(setCustomCooldown({position: slot.position, customCooldown: number}))
    }

    const handleRemove = () => {
        setIsEdit(false);
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
                                    <input autoFocus={true} type="text" className="LevelController__input" value={customValue} onChange={handeChangeCustomValue} onKeyUp={handleKeyUp}/>
                                </div>
                                <span className="LevelController__customTimeText">sec</span>
                            </div>
                            <span className={cn('LevelController__btn remove')} onClick={handleRemove}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 22">
                                    <path d="M8.05801 9.125C8.61029 9.125 9.05801 9.57271 9.05801 10.125V15.875C9.05783 16.4271 8.61018 16.875 8.05801 16.875C7.50598 16.8748 7.05818 16.427 7.05801 15.875V10.125C7.05801 9.57282 7.50587 9.12518 8.05801 9.125Z" />
                                    <path d="M11.892 9.125C12.4441 9.12518 12.892 9.57282 12.892 10.125V15.875C12.8918 16.427 12.444 16.8748 11.892 16.875C11.3398 16.875 10.8922 16.4271 10.892 15.875V10.125C10.892 9.57271 11.3397 9.125 11.892 9.125Z" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M11.892 0.5C12.6654 0.500086 13.4076 0.807588 13.9545 1.35449C14.5012 1.90143 14.809 2.64367 14.809 3.41699V4.33301H18.6L18.7025 4.33789C19.2067 4.38922 19.6 4.81533 19.6 5.33301C19.6 5.85068 19.2067 6.27679 18.7025 6.32812L18.6 6.33301H17.684V18.75C17.6839 19.5234 17.3764 20.2656 16.8295 20.8125C16.2826 21.3594 15.5404 21.6669 14.767 21.667H5.18398C4.41067 21.667 3.66842 21.3592 3.12148 20.8125C2.64292 20.3339 2.34798 19.7057 2.28164 19.0381L2.26699 18.75V6.33301H1.35C0.797715 6.33301 0.35 5.88529 0.35 5.33301C0.35 4.78072 0.797715 4.33301 1.35 4.33301H5.14199V3.41699C5.14199 2.64344 5.4495 1.90147 5.99648 1.35449C6.54347 0.807511 7.28544 0.5 8.05898 0.5H11.892ZM4.26699 18.75L4.27187 18.8408C4.29283 19.0504 4.38527 19.2482 4.53555 19.3984C4.70741 19.57 4.9411 19.667 5.18398 19.667H14.767C15.01 19.6669 15.2436 19.5703 15.4154 19.3984C15.5873 19.2266 15.6839 18.993 15.684 18.75V6.33301H4.26699V18.75ZM8.05898 2.5C7.81587 2.5 7.58246 2.59665 7.41055 2.76855C7.23864 2.94046 7.14199 3.17388 7.14199 3.41699V4.33301H12.809V3.41699C12.809 3.17411 12.712 2.94042 12.5404 2.76855C12.3686 2.59672 12.135 2.50009 11.892 2.5H8.05898Z" />
                                </svg>
                            </span>
                        </div>
                   </React.Fragment>
                :
                    <div className="LevelController__holder">
                        <span className={cn('LevelController__btn')} onClick={() => setIsEdit(true)}>
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
                                            <div className={cn('LevelController__indicatorBox', {active: index <= activeLevelIndex, pressed: pressedIndicator === index})} 
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

export default LevelControllerView;