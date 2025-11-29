import PanelToolbar from './PanelToolbar/PanelToolbar'
import PanelCore from './PanelCore/PanelCore'
import './TimerPanel.scss'

export default function TimerPanel() {

    return (
        <div className="TimerPanel">    
            <PanelToolbar />
            <PanelCore />
        </div>
    );
}