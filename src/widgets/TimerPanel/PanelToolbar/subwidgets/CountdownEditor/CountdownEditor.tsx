import React from 'react'
import cn from 'classnames'
import { useTranslations } from 'next-intl'

import './CountdownEditor.scss'
import ForwardIcon from '../../../../shared/ui/IconComponents/ForwardIcon'
import BackwarddIcon from '../../../../shared/ui/IconComponents/BackwardIcon'

interface IProps {

}

const CountdownEditor = (props: IProps) => {
    const translate = useTranslations('PlaygroundPage.TimerPanel')

    return (
        <div className={cn('CountdownEditor')}>
            {/* <HotkeyCell className={'CountdownEditor__leftHotkey'} position={1} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} hidden={hotKeyHidden}/> */}

            <div className={cn('CountdownEditor__iconBox', {highlight: false})} onPointerDown={() => null} onPointerUp={() => null} title={translate('time_back')}>
                <BackwarddIcon />
                {/* <div className={cn('CountdownEditor__hint left', {visible: hintsVisible})}>{getKeyFromCode(backwardHint.key)}</div> */}
            </div>
            
            <div className="CountdownEditor__inputOuter">
                <div className="CountdownEditor__inputBox">
                    <input type="text" className="CountdownEditor__input" value={''} onChange={() => null} onFocus={() => null} onBlur={() => null} onKeyUp={() => null}/>
                </div>
                <span className='CountdownEditor__inputCaption'>{translate('sec')}</span>
            </div>

            <div className={cn('CountdownEditor__iconBox', {highlight: false})} onPointerDown={() => null} onPointerUp={() => null} title={translate('time_forward')}>
                <ForwardIcon />
                {/* <div className={cn('CountdownEditor__hint right', {visible: hintsVisible})}>{getKeyFromCode(forwardHint.key)}</div> */}
            </div>
            
            {/* <HotkeyCell className={'CountdownEditor__rigthHotkey'} position={2} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} hidden={hotKeyHidden}/> */}
        </div>
    )
}

export default CountdownEditor;

