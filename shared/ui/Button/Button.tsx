'use client';
import React, { JSX, useContext } from 'react';
import { setUserPlayed } from '../../data/localStorageData';
import cn from 'classnames';
import './Button.scss';

interface IProps {
    className?: string
}

const Button = ({className}: IProps): JSX.Element => {
    const handleClick = () => {
        setUserPlayed();
    }

    return (
        <button className={cn('PlayButton', className)} onClick={handleClick}>
            <i className="PlayButton__animationArrow"/>
            <i className="PlayButton__animationArrow"/>
            <i className="PlayButton__animationArrow"/>
            <i className="PlayButton__animationArrow"/>
            <span className="PlayButton__text">{'get_started'}</span>
        </button>
    );
}

export default Button;

