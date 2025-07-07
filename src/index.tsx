/*!
 * SpellTimer v1.0.2
 * Author: ARTEMII KHAFIZOV
 * Contact: spelltimer@gmail.com
 * License: 2025 spelltimer.com. All rights reserved.
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