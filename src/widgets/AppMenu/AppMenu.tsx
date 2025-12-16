import Logo from "../../shared/ui/IconComponents/Logo"
import Footer from "../Footer/Footer"
import './AppMenu.scss'

export default function AppMenu() {

    return (
        <div className="AppMenu">    
            <div className="AppMenu__header">
                <Logo />
            </div>
            <div className="AppMenu__body"></div>
            <div className="AppMenu__footer">
                <Footer />
            </div>
        </div>
    );
}