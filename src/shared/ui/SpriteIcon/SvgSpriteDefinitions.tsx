import { manualSpriteSymbols } from './manual-icons';
import { spriteSymbols } from './sprite-data';

const hiddenStyle = {
    position: 'absolute',
    width: 0,
    height: 0,
    overflow: 'hidden'
} as const;

const SvgSpriteDefinitions = () => {
    return (
        <svg
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            style={hiddenStyle}
            dangerouslySetInnerHTML={{__html: spriteSymbols + manualSpriteSymbols}}
        />
    );
};

export default SvgSpriteDefinitions;
