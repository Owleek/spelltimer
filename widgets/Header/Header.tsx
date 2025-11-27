
import Logo from '../../shared/ui/IconComponents/Logo';
import SmallButton from '../../shared/ui/Button/SmallButton';
import cn from 'classnames';
import './header.scss';
import Link from 'next/link'

interface IProps {
    className?: string
}

const Header = ({className}: IProps) => {
    return (
        <div className={cn('header', className)}>
            <div className="header__logo"><Link href="/"><Logo /></Link></div>
            <Link href="/playground"><SmallButton /></Link>
        </div>
    );
} ;

export default Header;