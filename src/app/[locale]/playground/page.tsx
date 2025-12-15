import ImageCover from '../../../shared/ui/ImageCover/ImageCover'
import TimerPanel from '../../../widgets/TimerPanel/TimerPanel'
import './Playground.scss'

const Playground = () => {
    return (
        <div className="Playground">
            <ImageCover image="playground.webp" />
            <div className="Playground__inner">
                <TimerPanel />
            </div>
        </div>
    )
}

export default Playground