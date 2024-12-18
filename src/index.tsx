import ReactDom from 'react-dom/client';
import './index.scss';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('\'root\' not found');
}

const App = () => {
    return <div>Root screen</div>
}

const root = ReactDom.createRoot(rootElement);
root.render(<App/>);