import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { useSelector } from 'react-redux';
import { JSX } from 'react/jsx-runtime';
import { useDispatch } from 'react-redux';
import { addTyping, removeTyping } from '../../store/typingSlice';
import { addShift, EDirection } from '../../store/shiftSlice';
import cn from 'classnames';
import {TStoreState} from '../../store/store';
import { translateText } from '../../utils/utils';
import { getKeyFromCode } from '../../data/keyCodeDictionary';
import StageContext, {EStages} from '../../store/StageContext';
import {toSafeInteger} from '../../utils/utils';
import HotkeyCell from '../HotkeyCell/HotkeyCell';
import './CountdownEditor.scss';
import SpriteIcon from '@shared/ui/SpriteIcon';

interface IProps {

}

const CountdownEditor = (props: IProps): JSX.Element => {
    
    const TYPING_ID = 'CountdownInput';
    const initialValue: number | '' = 3;

    const dispatch = useDispatch();
    const noteHidden = useSelector((state: TStoreState) => state.noteSlice.value);
    const {currentStage, changeStage} = useContext(StageContext);
    const [inputValue, setInputValue] = useState<number | ''>(initialValue);
    const [keyPressed, setKeyPressed] = useState<(1 | 2 | null)>(null);

    const propsRef = useRef<IProps>(props);
    const inputValueRef = useRef<number | ''>(initialValue);

    const hotkeys = useSelector((state: TStoreState) => state.timeSlice);

    const backwardHint = hotkeys.find(item => item.position === 1);
    const forwardHint = hotkeys.find(item => item.position === 2);

    const {dictionary} = useSelector((state: TStoreState) => state.localeSlice);

    if (!forwardHint || !backwardHint) throw new Error('backward or forward keys not found');

    useEffect(() => {
        propsRef.current = props;
    }, [props]);

    useEffect(() => {
        inputValueRef.current = inputValue;
    }, [inputValue]);

    const handleChange = (e: any) => {
        const value = e.target.value.trim();
        if (value === '') return setInputValue('');
        const number = toSafeInteger(value);
        if (number === null) return null;
        setInputValue(number);
    }

    const handleFocus = (e: any) => {
        dispatch(addTyping({value: TYPING_ID}));
    }

    const handleBlur = (e: any) => {
        dispatch(removeTyping({value: TYPING_ID}));
    }

    const shiftTimeForward = useCallback(() => {
        const inputValue = inputValueRef.current;
        if (!inputValue || inputValue === 0) return;
        dispatch(addShift({value: inputValue, direction: EDirection.FORWARD}));
    }, []);

    const shiftTimeBackward =  useCallback(() => {
        const inputValue = inputValueRef.current;
        if (!inputValue || initialValue === 0) return;
        dispatch(addShift({value: inputValue, direction: EDirection.BACKWARD}))
    }, []);

    const hotKeyHidden = currentStage !== EStages.EDIT;
    const hintsVisible = currentStage === EStages.PLAY;

    const handleMouseDown = (keyNumber: (1 | 2)) => {
        setKeyPressed(keyNumber);
    }

    const handleMouseUp = (keyNumber: number) => {
        setKeyPressed(null);

        if (keyNumber === 1) shiftTimeBackward();
        if (keyNumber === 2) shiftTimeForward();
    }

    const handleKeyDown = (keyNumber: (1 | 2)) => {
        handleMouseDown(keyNumber);
    }

    const handleKeyUp = (keyNumber: (1 | 2)) => {
        handleMouseUp(keyNumber);
    }

    const handleKeyUpInput = (evt: any) => {
        if (evt.code === 'Escape' || evt.code === 'Enter') evt.target.blur();
    }

    return (
        <div className={cn('CountdownEditor')}>
            <HotkeyCell className={'CountdownEditor__leftHotkey'} position={1} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} hidden={hotKeyHidden}/>

            <div className={cn('CountdownEditor__iconBox', {highlight: keyPressed === 1})} onPointerDown={() => handleMouseDown(1)} onPointerUp={() => handleMouseUp(1)} title={translateText(dictionary, 'time_back')}>
                <SpriteIcon id="components-countdowneditor-countdowneditor-1" />
                <div className={cn('CountdownEditor__hint left', {visible: hintsVisible})}>{getKeyFromCode(backwardHint.key)}</div>
            </div>
            
            <div className="CountdownEditor__inputOuter">
                <div className="CountdownEditor__inputBox">
                    <input type="text" className="CountdownEditor__input" value={inputValue} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} onKeyUp={handleKeyUpInput}/>
                </div>
                <span className='CountdownEditor__inputCaption'>{translateText(dictionary, 'sec')}</span>
            </div>

            <div className={cn('CountdownEditor__iconBox', {highlight: keyPressed === 2})} onPointerDown={() => handleMouseDown(2)} onPointerUp={() => handleMouseUp(2)} title={translateText(dictionary, 'time_forward')}>
                <SpriteIcon id="components-countdowneditor-countdowneditor-2" />
                <div className={cn('CountdownEditor__hint right', {visible: hintsVisible})}>{getKeyFromCode(forwardHint.key)}</div>
            </div>
            
            <HotkeyCell className={'CountdownEditor__rigthHotkey'} position={2} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} hidden={hotKeyHidden}/>
        </div>
    )
}

export default CountdownEditor;