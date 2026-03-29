import React, { JSX, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IRequiredFields } from '../../data/data';
import {setActiveLevelIndex, setCustomCooldown, clearReducer} from '../../store/slotSlice';
import {toSafeInteger, translateText} from '../../utils/utils';
import {TStoreState} from '../../store/store';
import { addTyping, removeTyping } from '../../store/typingSlice';
import cn from 'classnames';
import './LevelController.scss';
import SpriteIcon from '@shared/ui/SpriteIcon';

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
                        <span className={cn('LevelController__btn save', {disabled: !customValue})} onClick={handleSave} title={translateText(dictionary, 'save')}>
                            <SpriteIcon id="components-levelcontroller-levelcontroller-1" />
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
                            <span className={cn('LevelController__btn remove')} onClick={handleRemove} title={translateText(dictionary, 'cancel_manual_cd')}>
                                <SpriteIcon id="components-levelcontroller-levelcontroller-2" />
                            </span>
                        </div>
                   </React.Fragment>
                :
                    <div className="LevelController__holder">
                        <span className={cn('LevelController__btn edit')} onClick={() => editLevelController(slot.position)} title={translateText(dictionary, 'manual_cd')}>
                            <SpriteIcon id="components-levelcontroller-levelcontroller-3" />
                        </span>
                        {
                            customCooldown ?
                                <div className="LevelController__customisation">
                                    <div className="LevelController__customTimeContainer">
                                        <span className="LevelController__customTimeNumber">{customCooldown}</span>
                                        <span className="LevelController__customTimeText">{translateText(dictionary, 'sec')}</span>
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