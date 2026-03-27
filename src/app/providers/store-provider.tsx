import { Provider } from 'react-redux';
import type { ReactNode } from 'react';
import store from '../../store/store';

interface IProps {
    children: ReactNode
}

const StoreProvider = ({children}: IProps) => {
    return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
