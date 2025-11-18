import React from 'react';
import { createPortal } from 'react-dom';
import {useSelector} from 'react-redux';
import {TStoreState} from '../../../shared/store/store';
import { translateText } from '../../../shared/lib/utils';
import './QrComponent.scss';

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
                <span className="QrComponent__close" onClick={onClose} title={ translateText(dictionary, 'close') }>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" >
                        <path d="M43.7147 1.4392C44.8865 2.61075 44.8866 4.51047 43.7149 5.68212L29.0215 20.3748C27.8498 21.5464 27.8498 23.4459 29.0214 24.6175L43.7152 39.3113C44.8868 40.4829 44.8868 42.3824 43.7152 43.554L43.454 43.8152C42.2824 44.9868 40.3829 44.9868 39.2113 43.8152L24.5175 29.1214C23.3459 27.9498 21.4464 27.9498 20.2748 29.1215L5.58212 43.8149C4.41047 44.9866 2.51076 44.9865 1.3392 43.8147L1.07845 43.5539C-0.0928846 42.3823 -0.092807 40.483 1.07862 39.3116L15.772 24.6174C16.9435 23.4459 16.9435 21.5464 15.7719 20.3749L1.07896 5.68189C-0.0926111 4.51032 -0.0926088 2.61083 1.07896 1.43925L1.33925 1.17896C2.51083 0.00739199 4.41032 0.00739157 5.58189 1.17896L20.2749 15.8719C21.4464 17.0435 23.3459 17.0435 24.5174 15.872L39.2116 1.17862C40.383 0.00719345 42.2823 0.00711489 43.4539 1.17845L43.7147 1.4392Z" />
                    </svg>
                </span>
                <div className="QrComponent__content">
                    <div className="QrComponent__code" style={{backgroundImage: `url("${img}")`}}></div>
                    <div className="QrComponent__button" onClick={onDonate}>
                        <span className="QrComponent__bracket left"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 40"><path d="M12 2H2V38H12V40H0V0H12V2Z"/></svg></span>
                        <span className="QrComponent__bracket right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 40"><path d="M12 40H0V38H10V2H0V0H12V40Z"/></svg></span>
                        <span className="QrComponent__buttonText">{btnText}</span>
                    </div>
                </div>
            </div>
        </div>
        , document.body);

}

export default QrComponent;

