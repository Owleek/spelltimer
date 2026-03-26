'use client'
import { useSetSet } from '../store/PanelStore/selectors';
import './TimerBoard.scss'

export default function TimerBoard() {
    const setSet = useSetSet()

    return (
        <div className="TimerBoard" onClick={setSet}>
            <div style={{width: '100px', height: '350px'}}></div>
        </div>
    );
}