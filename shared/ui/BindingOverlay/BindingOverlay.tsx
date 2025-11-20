import React from 'react';
import ReactDOM from 'react-dom';
import { JSX } from 'react/jsx-runtime';
import { translateText } from '../../lib/utils';
import {useSelector} from 'react-redux';
import {TStoreState} from '../../store/store';

const BindingOverlay = (): JSX.Element => {

    const {dictionary} = useSelector((state: TStoreState) => state.localeSlice);
    
    return <React.Fragment>
        {
            ReactDOM.createPortal(<div className="GeneralOverlay">
                             <span className='GeneralOverlay__text'>{translateText(dictionary, 'press_to_bind')}</span>
                            </div>, document.getElementById('root') as HTMLElement)
        }
    </React.Fragment>
}

export default BindingOverlay;

