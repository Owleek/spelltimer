import React, { JSX } from 'react';
import cn from 'classnames';
import './PlayButton.scss';

interface IProps {
    className: string
    onClick: () => void
}

const PlayButton = ({className, onClick}: IProps): JSX.Element => {
    return (
        <div className={cn('PlayButton', className)} onClick={onClick}>
            <svg viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clipRule="evenodd"/>
            </svg>
        </div>
    );
}

export default PlayButton;