import cn from "classnames"

const HotkeyHint = ({hotkey, isKeyPressed}: {hotkey: string, isKeyPressed: boolean}) => {
    return (
        <div className={cn('Timer__hint', {highlight: isKeyPressed})}>
            <span className="Timer__hintText">{hotkey}</span>
        </div>
    )
}

export default HotkeyHint