import ImageCover from '../../shared/ui/ImageCover/ImageCover'
import TimerPanel from '../../widgets/TimerPanel/TimerPanel'
import './Playground.scss'

const Playground = () => {
    return (
        <div className="Playground">
            <div className="Playground__inner">
                <ImageCover image="playground.webp" />
                <TimerPanel />
            </div>
        </div>
    )
}

export default Playground