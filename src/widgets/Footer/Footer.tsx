import cn from 'classnames'
import Link from 'next/link'
import DonateIcon from '../../shared/ui/IconComponents/DonateIcon'
import './footer.scss'


const Footer = () => {

    return (
        <div className="footer">
            
            <div className="footer__column">
                <Link href={'/about'} className="footer__link">about</Link>
                <Link href={'/contact'} className="footer__link">contact</Link>
                <Link href={'/policy'} className="footer__link">policy</Link>
            </div>

            <div className="footer__column rights">
                <p className="footer__item">© 2025 spelltimer.com</p>
                <p className="footer__item">rights</p>
            </div>

            <Link href={'/donation'} className="footer__donationButton">
                <DonateIcon />
            </Link>
        </div>
    );
}

export default Footer

