import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import ReactDOM from 'react-dom';
import { JSX } from 'react/jsx-runtime';
import { translate } from '../../utils/utils';

interface IProps {

}

const BindingOverlay = (props: IProps): JSX.Element => {
    
    return <React.Fragment>
        {
            ReactDOM.createPortal(<div className="GeneralOverlay">
                             <span className='GeneralOverlay__text'>{translate('Press any key to bind new key')}</span>
                            </div>, document.getElementById('root') as HTMLElement)
        }
    </React.Fragment>
}

export default BindingOverlay;