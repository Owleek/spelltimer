import cn from 'classnames';
import './SmallPlayButton.scss';

export default function SmallButton({className, onClick}: {className?: string, onClick?: () => void}) {
    return (
        <button className={cn('SmallPlayButton', className)} onClick={onClick}>
            <i className="SmallPlayButton__smallAnimationArrow"/>
            <i className="SmallPlayButton__smallAnimationArrow"/>
            <i className="SmallPlayButton__smallAnimationArrow"/>
            <i className="SmallPlayButton__smallAnimationArrow"/>
            <span className="SmallPlayButton__text">{'continue'}</span>
        </button>
    );
}