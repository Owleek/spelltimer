import ReactDom from 'react-dom/client';
import App from './App';
import './app.scss';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('\'root\' not found');
}

const root = ReactDom.createRoot(rootElement);
root.render(<App/>);