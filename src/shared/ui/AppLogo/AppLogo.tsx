import LogoIcon from '../IconComponents/LogoIcon'
import Link from 'next/link'
import cn from 'classnames'
import './style.scss'

export const AppLogo = ({className}: {className?: string}) => {
    return (
        <Link href="/" className={cn('AppLogo', className)}>
            <LogoIcon />
        </Link>
    )
}