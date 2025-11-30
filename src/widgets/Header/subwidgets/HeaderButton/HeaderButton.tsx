'use client';

import { usePathname } from 'next/navigation';
import Button from '../../../../shared/ui/Button/Button';

export default function HeaderButton() {
    const pathname = usePathname();
    const isNotPlayground = pathname !== '/playground';
    return isNotPlayground ? <Button small={true} className='header__button'/> : null;
}