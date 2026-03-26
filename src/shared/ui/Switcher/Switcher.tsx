'use client'
import './Switcher.scss'


function Switcher({checked, onChange}: {checked: boolean, onChange: () => void}) {
    return (
        <label className="toggle-switch ts-rounded ts-blue">
            <input type="checkbox" />
            <span className="slider"></span>
        </label>
    )
}

export default Switcher