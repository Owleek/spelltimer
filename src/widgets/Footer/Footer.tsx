import cn from 'classnames'
import Link from 'next/link'
import DonateIcon from '../../shared/ui/IconComponents/DonateIcon'
import { useTranslations } from 'next-intl'
import './footer.scss'

const Footer = () => {
    const translate = useTranslations('Footer')
    const links = ['about', 'contact', 'policy']

    return (
        <div className="footer">
            
            <div className="footer__column">
                { links.map(l => <Link key={l} href={`/${l}`} className="footer__link">{translate(l)}</Link>) }
            </div>

            <div className="footer__column rights">
                <p className="footer__item">© 2025 spelltimer.com</p>
                <p className="footer__item">{translate('right')}</p>
            </div>

            <Link href={'/donation'} className="footer__donationButton">
                <DonateIcon />
            </Link>
        </div>
    );
}

export default Footer

