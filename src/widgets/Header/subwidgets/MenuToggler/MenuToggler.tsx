'use client'
import MenuIcon from "../../../../shared/ui/IconComponents/MenuIcon";
import { useAppMenuStore } from "../../../AppMenu";
import './MenuToggler.scss'

export default function MenuToggler() {
    const isMenuVisible = useAppMenuStore(state => state.isVisible)
    const setVisible = useAppMenuStore(state => state.actions.setVisible)
    const toggleMenu = () => setVisible(!isMenuVisible)

    return (
        <MenuIcon className="Header__menuToggler" onClick={toggleMenu}/>
    );
}