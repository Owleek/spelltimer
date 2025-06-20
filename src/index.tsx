/*!
 * SpellTimer v1.0.0
 * Author: ARTEMII KHAFIZOV
 * Contact: artemy.hafizov@gmail.com
 * License: MIT
 */

import ReactDom from 'react-dom/client';
import {StrictMode} from 'react';
import App from './App';
import './app.scss';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('\'root\' not found');
}

const root = ReactDom.createRoot(rootElement);
root.render(<StrictMode><App/></StrictMode>);