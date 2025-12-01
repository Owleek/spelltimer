
import Logo from '../../shared/ui/IconComponents/Logo'
import SmallButton from '../../shared/ui/Button/SmallButton'
import cn from 'classnames'
import Link from 'next/link'
import LocaleSwicher from './subwidgets/LocaleSwitcher/LocaleSwitcher'
import './Header.scss'

interface IProps {
    className?: string
}

const Header = ({className}: IProps) => {
    return (
        <div className={cn('header', className)}>
            <div className="header__logo"><Link href="/"><Logo /></Link></div>
            {/* <Link href="/playground" className="header__button"><SmallButton /></Link> */}
            <LocaleSwicher className='Header__LocaleSwicher'/>
        </div>
    );
}

export default Header