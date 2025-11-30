import type { Metadata, Viewport } from 'next';


import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '../../i18n/routing';

import StoreProvider from '../_internal/providers/StoreProvider';
import Header from '../../widgets/Header/Header';
import Footer from '../../widgets/Footer/Footer';
import './global.scss';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: 'SpellTimer — контроль кулдаунов',
  description: 'SpellTimer — бесплатное вспомогательное приложение для контроля кулдаунов способностей и предметов в Dota 2. Без нарушений, без установки, прямо в браузере.',
  keywords: 'Dota 2, таймер, перезарядка, SpellTimer, cooldown, dota tools, вспомогательное приложение, дота 2, кулдаун, кд, отслеживать кд, приложение для дота 2, утилита для дота 2, софт для дота 2, калькулятор кд, посчитать кд спелов, посчитать кд способностей дота 2, посчитать кд aбилок, spell timer, speltimer, spel timer, таймер способностей, таймер перезарядок, таймер кулдаунов, таймер кд, кд спелов, кд способностей, timer',
  openGraph: {
    title: 'SpellTimer — контроль кулдаунов',
    description: 'SpellTimer — бесплатный инструмент для отслеживания таймеров способностей в Dota 2.',
    images: ['https://spelltimer.com/preview.png'],
    url: 'https://spelltimer.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpellTimer — контроль кулдаунов',
    description: 'SpellTimer — бесплатный инструмент для отслеживания таймеров способностей в Dota 2.',
    images: ['https://spelltimer.com/preview.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/manifest.json',
};


type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export default async function RootLayout({ children, params }: Props) {

  const {locale} = await params;
  
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang="ru">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body style={{ height: '100dvh', overflow: 'hidden', minWidth: '320px', backgroundColor: 'rgba(60, 60, 60)', margin: 0, padding: 0 }}>
          <div className="AppContainer">
            <StoreProvider>
              <NextIntlClientProvider>
                <Header />
                  {children}
                <Footer />
              </NextIntlClientProvider>
            </StoreProvider>
          </div>
      </body>
    </html>
  );
}

