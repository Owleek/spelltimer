import PanelToolbar from './PanelToolbar/PanelToolbar'
import TimerBoard from './TimerBoard/TimerBoard'
import './TimerPanel.scss'

export default function TimerPanel() {

    return (
        <div className="TimerPanel">    
            <TimerBoard />
            <PanelToolbar />
        </div>
    );
}