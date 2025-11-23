
import Logo from '../../shared/ui/IconComponents/Logo';
import SmallButton from '../../shared/ui/Button/SmallButton';
import cn from 'classnames';
import './header.scss';

interface IProps {
    className?: string
}

const Header = ({className}: IProps) => {
    return (
        <div className={cn('header', className)}>
            <div className="header__logo"><Logo /></div>
            <SmallButton />
        </div>
    );
} ;

export default Header;

