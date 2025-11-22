'use client';

import { Provider } from 'react-redux';
import { YMInitializer } from 'react-yandex-metrika';
import store from '../shared/store/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <YMInitializer
        accounts={[102442825]}
        options={{ webvisor: true, clickmap: true, trackLinks: true }}
        version="2"
      />
      {children}
    </Provider>
  );
}

