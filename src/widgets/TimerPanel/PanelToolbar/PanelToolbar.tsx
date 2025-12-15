'use client'
import cn from 'classnames'
import { useTranslations } from 'next-intl'
import ForwardIcon from '../../../shared/ui/IconComponents/ForwardIcon'
import BackwardIcon from '../../../shared/ui/IconComponents/BackwardIcon'
import PlayIcon from '../../../shared/ui/IconComponents/PlayIcon'
import PauseIcon from '../../../shared/ui/IconComponents/PauseIcon'
import ClearIcon from '../../../shared/ui/IconComponents/ClearIcon'
import { usePanelState, useSetReady, useSetRunning, useSetPaused, useSetUnset, useSetSet } from '../store/PanelStore/selectors'
import { PanelState } from '../store/PanelStore/types'
import './PanelToolbar.scss'

export default function PanelToolbar() {
    const translate = useTranslations('PlaygroundPage.TimerPanel')

    const panelState = usePanelState()

    const forwardButtonDisabled = panelState === PanelState.UNSET
    const forwardButtonVisible = panelState === PanelState.SET || panelState === PanelState.UNSET

    const runButtonVisible = panelState === PanelState.READY || panelState === PanelState.PAUSED

    const pauseButtonVisible = panelState === PanelState.RUNNING
    
    const clearButtonVisible = panelState === PanelState.SET

    const backwardButtonVisible = panelState === PanelState.READY || panelState === PanelState.RUNNING || panelState === PanelState.PAUSED

    const setReady = useSetReady()
    const setRunning = useSetRunning()
    const setPaused = useSetPaused()
    const clearTimerBoard = useSetUnset()
    const backToSet = useSetSet()

    return (
        <div className="PanelToolbar">
            <ClearIcon 
                    className={cn('PanelToolbar__button clearButton', {visible: clearButtonVisible})} 
                    onClick={clearTimerBoard}
                    title={'clear'}
            />
            <ForwardIcon 
                    className={cn('PanelToolbar__button forwardButton', {disabled: forwardButtonDisabled, visible: forwardButtonVisible})}
                    onClick={setReady}
                    title={translate('start_mode')}
                    emptyArrowId='forwardsEmptyArrow'   
            />
            <PlayIcon 
                    className={cn('PanelToolbar__button runButton', {visible: runButtonVisible})} 
                    onClick={setRunning} 
                    title={'start'}
            />
            <PauseIcon 
                    className={cn('PanelToolbar__button pauseButton', {visible: pauseButtonVisible})} 
                    onClick={setPaused} 
                    title={'pause'}
            />
            <BackwardIcon 
                    className={cn('PanelToolbar__button backwardButton', {visible: backwardButtonVisible})} 
                    onClick={backToSet} 
                    title={'backward'}
                    emptyArrowId='backwardsEmptyArrow'
            />
        </div>
    )
}

