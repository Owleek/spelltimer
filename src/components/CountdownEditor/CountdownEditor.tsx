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

            <div className={cn('CountdownEditor__iconBox', {highlight: keyPressed === 1})} onMouseDown={() => handleMouseDown(1)} onMouseUp={() => handleMouseUp(1)} onTouchStart={() => handleMouseDown(1)} onTouchEnd={() => handleMouseUp(1)} onTouchCancel={() => handleMouseUp(1)} title={translateText(dictionary, 'time_back')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
                    <path d="M28.0225 14.2139C28.8609 13.6698 29.9999 14.2256 30 15.1836V24.8115C29.9997 25.7693 28.8483 26.3371 28.0225 25.7812L20.8018 20.9678C20.0884 20.4947 20.0884 19.5004 20.8018 19.0273L28.0225 14.2139Z" />
                    <path d="M16.7471 14.2139C17.5855 13.6701 18.7235 14.2257 18.7236 15.1836V24.8115C18.7234 25.7692 17.5854 26.3249 16.7471 25.7695L9.52539 20.9551C8.82491 20.4937 8.82471 19.5004 9.52539 19.0273L16.7471 14.2139Z" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M20 0C31.0457 0 40 8.9543 40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0ZM20 4C11.1634 4 4 11.1634 4 20C4 28.8366 11.1634 36 20 36C28.8366 36 36 28.8366 36 20C36 11.1634 28.8366 4 20 4Z" />
                </svg>
                <div className={cn('CountdownEditor__hint left', {visible: hintsVisible})}>{getKeyFromCode(backwardHint.key)}</div>
            </div>
            
            <div className="CountdownEditor__inputOuter">
                <div className="CountdownEditor__inputBox">
                    <input type="text" className="CountdownEditor__input" value={inputValue} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} onKeyUp={handleKeyUpInput}/>
                </div>
                <span className='CountdownEditor__inputCaption'>{translateText(dictionary, 'sec')}</span>
            </div>

            <div className={cn('CountdownEditor__iconBox', {highlight: keyPressed === 2})} onMouseDown={() => handleMouseDown(2)} onMouseUp={() => handleMouseUp(2)} onTouchStart={() => handleMouseDown(2)} onTouchEnd={() => handleMouseUp(2)} onTouchCancel={() => handleMouseUp(2)} title={translateText(dictionary, 'time_forward')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
                    <path d="M11.9775 25.7861C11.1391 26.3302 10.0001 25.7744 10 24.8164V15.1885C10.0003 14.2307 11.1517 13.6629 11.9775 14.2188L19.1982 19.0322C19.9116 19.5053 19.9116 20.4996 19.1982 20.9727L11.9775 25.7861Z" />
                    <path d="M23.2529 25.7861C22.4145 26.3299 21.2765 25.7743 21.2764 24.8164V15.1885C21.2766 14.2308 22.4146 13.6751 23.2529 14.2305L30.4746 19.0449C31.1751 19.5063 31.1753 20.4996 30.4746 20.9727L23.2529 25.7861Z" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20C40 31.0457 31.0457 40 20 40ZM20 36C28.8366 36 36 28.8366 36 20C36 11.1634 28.8366 4 20 4C11.1634 4 4 11.1634 4 20C4 28.8366 11.1634 36 20 36Z" />
                </svg>
                <div className={cn('CountdownEditor__hint right', {visible: hintsVisible})}>{getKeyFromCode(forwardHint.key)}</div>
            </div>
            
            <HotkeyCell className={'CountdownEditor__rigthHotkey'} position={2} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} hidden={hotKeyHidden}/>
        </div>
    )
}

export default CountdownEditor;