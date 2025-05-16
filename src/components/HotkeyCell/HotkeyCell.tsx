import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { JSX } from 'react/jsx-runtime';
import { useDispatch } from 'react-redux';
import { setHotkey } from '../../store/hotkeySlice';
import { hideNodeRunTrigger } from '../../store/noteSlice';
import cn from 'classnames';
import {TStoreState} from '../../store/store';
import './HotkeyCell.scss';
import { translate } from '../../utils/utils';
import { getKeyFromCode } from '../../data/keyCodeDictionary';
import StageContext, {EStages} from '../../store/StageContext';
import {EAppStatus} from '../Playground/SettingsStage/SettingsStage';

interface IProps {
    className: string
    position: number
    onKeyPress: () => void
}

const HotkeyCell = (props: IProps): JSX.Element => {
    const dispatch = useDispatch();
    const hotkeys = useSelector((state: TStoreState) => state.timeSlice);
    const typigEntitiesSlice = useSelector((state: TStoreState) => state.typingSlice);
    
    const foundItem = hotkeys.find(item => item.position === props.position);

    if (!foundItem) throw new Error('timeControl not found');

    const noteHidden = useSelector((state: TStoreState) => state.noteSlice.value);
    const [isBinding, setIsBinding] = useState<boolean>(false);
    const {currentStage, changeStage} = useContext(StageContext);

    const {className, position, onKeyPress} = props;

    const propsRef = useRef<IProps>(props);
    const bindKeyRef = useRef<string>(foundItem.key);
    const isBindingRef = useRef<boolean>(isBinding);
    const isTypingRef = useRef<boolean>(!!typigEntitiesSlice.entities.length);

    useEffect(()=>{
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    useEffect(() => {
        propsRef.current = props;
    }, [props]);

    useEffect(() => {
        isBindingRef.current = isBinding;
    }, [isBinding]);

    useEffect(() => {
        const _foundItem = hotkeys.find(item => item.position === props.position);
        if (!_foundItem) throw new Error('timeControl not found');

        bindKeyRef.current = _foundItem.key;
    }, [hotkeys]);

    useEffect(() => {
        isTypingRef.current = !!typigEntitiesSlice.entities.length;
    }, [typigEntitiesSlice]);    

    const onKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.code !== bindKeyRef.current || isBindingRef.current || isTypingRef.current) return;
        onKeyPress();
    }, []);

    const getKey = useCallback((event: KeyboardEvent) => {
        const keyIs = event.code;
        setIsBinding(false);
        document.removeEventListener('keydown', getKey);

        if (keyIs === 'Escape') return;

        dispatch(setHotkey({key: keyIs, id: position, type: 'time'}));
    }, []);

    const onBindHotKey = () => {
        setIsBinding(true);
        document.addEventListener('keydown', getKey);
    }

    return (
        <React.Fragment>
            { 
                isBinding && ReactDOM.createPortal(<div className="GeneralOverlay">
                 <span className='CountdownEditor__textOnBinding'>{translate('Press any key to bind new key')}</span>
                </div>, document.getElementById('root') as HTMLElement)
            }

            <div className={cn('HotkeyCellWrapper', className)}>
                <div className={cn('HotkeyCell', {onTopOfTheSky: isBinding})}>
                    <div className={cn('HotkeyCell__inner')} onClick={!isBinding ? onBindHotKey : () => null}>
                        { isBinding ? <div>...</div> : <div className="HotkeyCell__text">{getKeyFromCode(foundItem.key)}</div> }
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}

export default HotkeyCell;