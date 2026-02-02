import { createPortal } from 'react-dom';
import cn from 'classnames';

interface IProps {
    outerContainer: Element | null
    isAnimated: boolean
}

const TimerIndicator = ({isAnimated}: {isAnimated: boolean}) => {
    return (
        <div className={cn('Timer__statusBox', {animateIndicator: !!isAnimated})}>
            <div className={cn('Timer__statusInnerWrapper')}>
                <div className="Timer__statusIndicatorBackground"></div>
                <div className="Timer__statusIndicatorBackground"></div>
                <div className="Timer__statusIndicatorBackground"></div>
                <div className="Timer__statusIndicatorBackground"></div>
                <span className="Timer__statusIndicator"></span>
                <span className="Timer__statusIndicator"></span>
                <span className="Timer__statusIndicator"></span>
                <span className="Timer__statusIndicator"></span>
            </div>
        </div>
    )
}

const AnimatedBorder = ({outerContainer, isAnimated}: IProps): null => {
    createPortal(<TimerIndicator isAnimated={isAnimated} />, outerContainer as Element)
    return null
}

export default AnimatedBorder;