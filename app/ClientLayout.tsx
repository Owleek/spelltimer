'use client';

import { Provider } from 'react-redux';
import { YMInitializer } from 'react-yandex-metrika';
import store from '../shared/store/store';
import Header from '../widgets/Header/Header';
import Footer from '../widgets/Footer/Footer';
import { useState } from 'react';
import cn from 'classnames';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [headerBottomOnMobile, setHeaderBottomOnMobile] = useState<boolean>(false);

  return (
    <Provider store={store}>
      <YMInitializer
        accounts={[102442825]}
        options={{ webvisor: true, clickmap: true, trackLinks: true }}
        version="2"
      />
      <Header />
      {children}
      <Footer className=''/>
      <div className={cn('toggleHeaderBottomOnMobile')} onClick={() => setHeaderBottomOnMobile(!headerBottomOnMobile)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M17.3125 14.5C17.8648 14.5 18.3125 14.9477 18.3125 15.5C18.3125 16.0523 17.8648 16.5 17.3125 16.5H6.4375C5.88522 16.5 5.4375 16.0523 5.4375 15.5C5.4375 14.9477 5.88522 14.5 6.4375 14.5H17.3125Z" />
          <path d="M17.3125 10.875C17.8648 10.875 18.3125 11.3227 18.3125 11.875C18.3125 12.4273 17.8648 12.875 17.3125 12.875H6.4375C5.88522 12.875 5.4375 12.4273 5.4375 11.875C5.4375 11.3227 5.88522 10.875 6.4375 10.875H17.3125Z" />
          <path d="M17.3125 7.25C17.8648 7.25 18.3125 7.69772 18.3125 8.25C18.3125 8.80228 17.8648 9.25 17.3125 9.25H6.4375C5.88522 9.25 5.4375 8.80228 5.4375 8.25C5.4375 7.69772 5.88522 7.25 6.4375 7.25H17.3125Z" />
          <path fillRule="evenodd" clipRule="evenodd" d="M19.125 0C21.671 0 23.75 2.07897 23.75 4.625V19.125C23.75 21.671 21.671 23.75 19.125 23.75H4.625C2.07897 23.75 0 21.671 0 19.125V4.625C0 2.07897 2.07897 0 4.625 0H19.125ZM4.625 2C3.18353 2 2 3.18353 2 4.625V19.125C2 20.5665 3.18353 21.75 4.625 21.75H19.125C20.5665 21.75 21.75 20.5665 21.75 19.125V4.625C21.75 3.18353 20.5665 2 19.125 2H4.625Z" />
        </svg>
      </div>
    </Provider>
  );
}

