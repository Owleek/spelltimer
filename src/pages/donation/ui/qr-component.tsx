import React from 'react';
import { createPortal } from 'react-dom';
import {useSelector} from 'react-redux';
import {TStoreState} from '../../../store/store';
import { translateText } from '../../../utils/utils';
import './qr-component.scss';
import SpriteIcon from '@shared/ui/SpriteIcon';

interface IProps {
    img: string
    onClose: () => void
    onDonate: () => void
    btnText: string
}

const QrComponent = ({img, onClose, onDonate, btnText}: IProps) => {
    const {dictionary} = useSelector((state: TStoreState) => state.localeSlice);

    return createPortal(
        <div className="QrComponent">
            <div className="QrComponent__inner">
                <span className="QrComponent__close" onClick={onClose} title={translateText(dictionary, 'close')}>
                    <SpriteIcon id="pages-donation-ui-qr-component-1" />
                </span>
                <div className="QrComponent__content">
                    <div className="QrComponent__code" style={{backgroundImage: `url("${img}")`}}></div>
                    <div className="QrComponent__button" onClick={onDonate}>
                        <span className="QrComponent__bracket left"><SpriteIcon id="pages-donation-ui-qr-component-2" /></span>
                        <span className="QrComponent__bracket right"><SpriteIcon id="pages-donation-ui-qr-component-3" /></span>
                        <span className="QrComponent__buttonText">{btnText}</span>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default QrComponent;
