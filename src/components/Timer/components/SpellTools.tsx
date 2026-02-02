import React from "react"
import { createPortal } from 'react-dom';
import cn from "classnames"
import { TStoreState } from '../../../store/store'
import { useSelector } from 'react-redux'
import { translateText } from '../../../utils/utils'
import { ETimerStatus } from '../TimerView'

interface IProps {
    isBinding: any
    keyPressed: any
    handleBindKey: any
    hotkey: any,
    timerStatus: ETimerStatus
    removeTimer: any
    ability: any
    outerContainer: any
}

const Box = ({isBinding, keyPressed, handleBindKey, hotkey, timerStatus, removeTimer, ability, outerContainer}: IProps) => {
    const { dictionary } = useSelector((state: TStoreState) => state.localeSlice);

    return (
        <React.Fragment>
            <div className="Timer__disabled"></div>

            <div className={cn('Timer__slotHotkey', {isBinding: isBinding, highlight: keyPressed})} onClick={handleBindKey} title={translateText(dictionary, 'hotkey_toggle_timer')}>
                <div className='Timer__slotHotKeyTextBox'>
                    <span className="Timer__slotHotKeyText">
                        { isBinding ? <span>...</span> : hotkey }
                    </span>
                </div>
            </div>

            <div className="Timer__controls">
                <div className={cn('Timer__controlButton refresh', {hidden: timerStatus === ETimerStatus.READY})} onClick={() => {}} title={translateText(dictionary, 'reset_timer')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                        <path d="M16.5 9C15.7381 9 15.3769 9.53688 15.25 10.1038C14.7931 12.1438 12.8544 15.25 9 15.25C5.54813 15.25 2.75 12.4512 2.75 9C2.75 5.54875 5.54813 2.75 9 2.75C10.4 2.75 11.6844 3.22063 12.725 4H11.5C10.81 4 10.25 4.56 10.25 5.25C10.25 5.94 10.81 6.5 11.5 6.5H15.25C15.94 6.5 16.5 5.94 16.5 5.25V1.5C16.5 0.81 15.94 0.25 15.25 0.25C14.56 0.25 14 0.81 14 1.5V1.82375C12.5831 0.8325 10.8606 0.25 9 0.25C4.1675 0.25 0.25 4.1675 0.25 9C0.25 13.8325 4.1675 17.75 9 17.75C15.2369 17.75 17.75 11.8125 17.75 10.3281C17.75 9.42 17.0863 9 16.5 9Z"/>
                    </svg>
                </div>
                <div className="Timer__controlButton remove" onClick={() => removeTimer(ability)} title={translateText(dictionary, 'delete')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 22">
                        <path d="M8.05801 9.125C8.61029 9.125 9.05801 9.57271 9.05801 10.125V15.875C9.05783 16.4271 8.61018 16.875 8.05801 16.875C7.50598 16.8748 7.05818 16.427 7.05801 15.875V10.125C7.05801 9.57282 7.50587 9.12518 8.05801 9.125Z" />
                        <path d="M11.892 9.125C12.4441 9.12518 12.892 9.57282 12.892 10.125V15.875C12.8918 16.427 12.444 16.8748 11.892 16.875C11.3398 16.875 10.8922 16.4271 10.892 15.875V10.125C10.892 9.57271 11.3397 9.125 11.892 9.125Z" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M11.892 0.5C12.6654 0.500086 13.4076 0.807588 13.9545 1.35449C14.5012 1.90143 14.809 2.64367 14.809 3.41699V4.33301H18.6L18.7025 4.33789C19.2067 4.38922 19.6 4.81533 19.6 5.33301C19.6 5.85068 19.2067 6.27679 18.7025 6.32812L18.6 6.33301H17.684V18.75C17.6839 19.5234 17.3764 20.2656 16.8295 20.8125C16.2826 21.3594 15.5404 21.6669 14.767 21.667H5.18398C4.41067 21.667 3.66842 21.3592 3.12148 20.8125C2.64292 20.3339 2.34798 19.7057 2.28164 19.0381L2.26699 18.75V6.33301H1.35C0.797715 6.33301 0.35 5.88529 0.35 5.33301C0.35 4.78072 0.797715 4.33301 1.35 4.33301H5.14199V3.41699C5.14199 2.64344 5.4495 1.90147 5.99648 1.35449C6.54347 0.807511 7.28544 0.5 8.05898 0.5H11.892ZM4.26699 18.75L4.27187 18.8408C4.29283 19.0504 4.38527 19.2482 4.53555 19.3984C4.70741 19.57 4.9411 19.667 5.18398 19.667H14.767C15.01 19.6669 15.2436 19.5703 15.4154 19.3984C15.5873 19.2266 15.6839 18.993 15.684 18.75V6.33301H4.26699V18.75ZM8.05898 2.5C7.81587 2.5 7.58246 2.59665 7.41055 2.76855C7.23864 2.94046 7.14199 3.17388 7.14199 3.41699V4.33301H12.809V3.41699C12.809 3.17411 12.712 2.94042 12.5404 2.76855C12.3686 2.59672 12.135 2.50009 11.892 2.5H8.05898Z" />
                    </svg>
                </div>
            </div>
        </React.Fragment>
    )
}

const SpellTools = (props: IProps) => {
     createPortal(<Box {...props}/>, props.outerContainer)
     return null
}

export default SpellTools