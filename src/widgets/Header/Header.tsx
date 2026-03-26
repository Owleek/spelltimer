import cn from 'classnames'
import MenuToggler from './subwidgets/MenuToggler/MenuToggler'
import { AppLogo } from '../../shared/ui/AppLogo'
import './header.scss'

interface IProps {
    className?: string
}

const Header = ({className}: IProps) => {
    return (
        <header className={cn('Header', className)}>
           <AppLogo className="Header__Logo"/>
            <MenuToggler />
        </header>
    );
}

export default Header