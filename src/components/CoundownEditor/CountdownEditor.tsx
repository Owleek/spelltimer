import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { JSX } from 'react/jsx-runtime';
import { useDispatch } from 'react-redux';
import { setHotkey } from '../../store/hotkeySlice';
import { hideNodeRunTrigger } from '../../store/noteSlice';
import cn from 'classnames';
import {TStoreState} from '../../store/store';
import './CountdownEditor.scss';
import { translate } from '../../utils/utils';
import { getKeyFromCode } from '../../data/keyCodeDictionary';
import StageContext, {EStages} from '../../store/StageContext';
import {EAppStatus} from '../Playground/SettingsStage/SettingsStage';

interface IProps {

}

const CountdownEditor = (props: IProps): JSX.Element => {
    const dispatch = useDispatch();

    return (
        <div className={cn('CountdownEditor')}>
            
        </div>
    )
}

export default CountdownEditor;