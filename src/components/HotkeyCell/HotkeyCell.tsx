import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { JSX } from 'react/jsx-runtime';
import { useDispatch } from 'react-redux';
import { setHotkey } from '../../store/hotkeySlice';
import { hideNodeRunTrigger } from '../../store/noteSlice';
import { setBindingSlice } from '../../store/bindingSlice';
import cn from 'classnames';
import {TStoreState} from '../../store/store';
import './HotkeyCell.scss';
import { translate } from '../../utils/utils';
import { getKeyFromCode } from '../../data/keyCodeDictionary';
import StageContext, {EStages} from '../../store/StageContext';
import {EAppStatus} from '../Playground/SettingsStage/SettingsStage';
import BindingOverlay from '../BindingOverlay/BindingOverlay';

interface IProps {
    className: string
    position: (1 | 2)
    onKeyDown: (num: (1 | 2)) => void
    onKeyUp: (num: (1 | 2)) => void
    hidden: boolean
}

const HotkeyCell = (props: IProps): JSX.Element => {
    const dispatch = useDispatch();
    const typigEntitiesSlice = useSelector((state: TStoreState) => state.typingSlice);
    const someOneIsBinding = useSelector((state: TStoreState) => state.bindingSlice.value);
    
    const hotkeys = useSelector((state: TStoreState) => state.timeSlice);
    const foundItem = hotkeys.find(item => item.position === props.position);

    if (!foundItem) throw new Error('timeControl not found');

    const noteHidden = useSelector((state: TStoreState) => state.noteSlice.value);
    const [isBinding, setIsBinding] = useState<boolean>(false);
    const {className, position, onKeyDown, hidden, onKeyUp} = props;

    const propsRef = useRef<IProps>(props);
    const bindKeyRef = useRef<string>(foundItem.key);
    const isBindingRef = useRef<boolean>(someOneIsBinding);
    const isTypingRef = useRef<boolean>(!!typigEntitiesSlice.entities.length);

    useEffect(()=>{
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keydown', handleKeyUp);
        }
    }, []);

    useEffect(() => {
        propsRef.current = props;
    }, [props]);

    useEffect(() => {
        isBindingRef.current = someOneIsBinding;
    }, [someOneIsBinding]);

    useEffect(() => {
        const _foundItem = hotkeys.find(item => item.position === props.position);
        if (!_foundItem) throw new Error('timeControl not found');

        bindKeyRef.current = _foundItem.key;
    }, [hotkeys]);

    useEffect(() => {
        isTypingRef.current = !!typigEntitiesSlice.entities.length;
    }, [typigEntitiesSlice]);    

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.code !== bindKeyRef.current || isBindingRef.current || isTypingRef.current) return;
        onKeyDown(position);
    }, []);
  
    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        if (event.code !== bindKeyRef.current || isBindingRef.current || isTypingRef.current) return;
        onKeyUp(position);
    }, []);

    const getKey = useCallback((event: KeyboardEvent) => {
        const keyIs = event.code;
        setIsBinding(false);
        dispatch(setBindingSlice(false));
        document.removeEventListener('keydown', getKey);

        if (keyIs === 'Escape') return;

        dispatch(setHotkey({key: keyIs, id: position, type: 'time'}));
    }, []);

    const onBindHotKey = () => {
        setIsBinding(true);
        dispatch(setBindingSlice(true));
        document.addEventListener('keydown', getKey);
    }

    const hotkey = getKeyFromCode(foundItem.key);

    return (
        <React.Fragment>
            <div className={cn('HotkeyCellWrapper', className, {hidden: hidden})} title={hotkey}>
                <div className={cn('HotkeyCell', {onTopOfTheSky: isBinding})} onClick={onBindHotKey}>
                    { isBinding ? <div>...</div> : <div className="HotkeyCell__text">{hotkey}</div> }
                </div>
            </div>

        </React.Fragment>
    )
}

export default HotkeyCell;