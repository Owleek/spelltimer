import React, { JSX } from 'react';
import './PlayButton.scss';


const PlayButton = ({onClick}: {onClick: () => void}): JSX.Element => {
    return (
        <div className="PlayButton" onClick={onClick}>
            <svg viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clipRule="evenodd"/>
            </svg>
        </div>
    );
}

export default PlayButton;