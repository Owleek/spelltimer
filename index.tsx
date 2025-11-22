/*!
 * SpellTimer v1.0.3
 * Author: ARTEMII KHAFIZOV
 * Contact: spelltimer@gmail.com
 * License: 2025 spelltimer.com. All rights reserved.
 */

import React from 'react';
import ReactDom from 'react-dom/client';
import {StrictMode} from 'react';
import RootLayout from './app/layout';
import PageLayout from './app/page';
import './app/styles/app.scss';


const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('\'root\' not found');
}

const root = ReactDom.createRoot(rootElement);
root.render(<StrictMode><RootLayout><PageLayout /></RootLayout></StrictMode>);