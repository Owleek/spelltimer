import SmallButton from '../../shared/ui/Button/SmallButton'
import cn from 'classnames'
import MenuToggler from './subwidgets/MenuToggler/MenuToggler'
import LocaleSwicher from './subwidgets/LocaleSwitcher/LocaleSwitcher'
import { AppLogo } from '../../shared/ui/AppLogo'
import './Header.scss'

interface IProps {
    className?: string
}

const Header = ({className}: IProps) => {
    return (
        <header className={cn('Header', className)}>
            {/* <Link href="/playground" className="header__button"><SmallButton /></Link> */}
            {/* <LocaleSwicher className='Header__LocaleSwicher'/> */}
           <AppLogo className="Header__Logo"/>
            <MenuToggler />
        </header>
    );
}

export default Header