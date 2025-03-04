// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
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