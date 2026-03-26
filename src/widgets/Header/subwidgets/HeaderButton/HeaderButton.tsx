'use client';

import { usePathname } from 'next/navigation';
import SmallButton from '../../../../shared/ui/Button/SmallButton';

export default function HeaderButton() {
    const pathname = usePathname();
    const isNotPlayground = pathname !== '/playground';
    return isNotPlayground ? <SmallButton className='header__button' /> : null;
}