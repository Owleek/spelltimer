import React, { JSX, useContext } from 'react';
import { translateText } from '../../../utils/utils';
import { useSelector } from 'react-redux';
import PageContext, { EPage } from '../../../store/PageContext';
import { TStoreState } from '../../../store/store';
import { setUserPlayed } from '../../../user_cache/keys';
import cn from 'classnames';
import './PlayButton.scss';
import './SmallPlayButton.scss';

interface IProps {
    className?: string
    small?: boolean
}

const PlayButton = ({className, small}: IProps): JSX.Element => {
    const context = useContext(PageContext);

    if (!context) throw new Error('no context in btn component');

    const dictionary = useSelector((state: TStoreState) => state.localeSlice.dictionary);
    const slotList = useSelector((state: TStoreState) => state.slotList, (prev, next) => JSON.stringify(prev) === JSON.stringify(next));
    const inprogress = !!slotList.find(slot => 'name' in slot);

    const handleClick = () => {
        setUserPlayed();
        context.onSelectArticle(EPage.PLAYGROUND);
    }

    return (
        <React.Fragment>
            {
                small ?
                <button className={cn('SmallPlayButton', className)} onClick={handleClick}>
                    <i className="SmallPlayButton__smallAnimationArrow"/>
                    <i className="SmallPlayButton__smallAnimationArrow"/>
                    <i className="SmallPlayButton__smallAnimationArrow"/>
                    <i className="SmallPlayButton__smallAnimationArrow"/>
                    <span className="SmallPlayButton__text">{translateText(dictionary, inprogress ? 'continue' : 'get_started')}</span>
                </button>
                :
                <button className={cn('PlayButton', className)} onClick={handleClick}>
                    <i className="PlayButton__animationArrow"/>
                    <i className="PlayButton__animationArrow"/>
                    <i className="PlayButton__animationArrow"/>
                    <i className="PlayButton__animationArrow"/>
                    <span className="PlayButton__text">{translateText(dictionary, inprogress ? 'continue' : 'get_started')}</span>
                </button>
            }
        </React.Fragment>
    );
}

export default PlayButton;

