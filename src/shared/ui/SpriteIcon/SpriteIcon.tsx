import { ComponentPropsWithoutRef } from 'react';
import { manualSpriteViewBoxes } from './manual-icons';
import { spriteViewBoxes } from './sprite-data';

const allSpriteViewBoxes = {
    ...spriteViewBoxes,
    ...manualSpriteViewBoxes
} as const;

type TSpriteId = keyof typeof allSpriteViewBoxes;

type IProps = Omit<ComponentPropsWithoutRef<'svg'>, 'children'> & {
    id: TSpriteId | string
};

const SpriteIcon = ({id, ...props}: IProps) => {
    const viewBox = allSpriteViewBoxes[id as TSpriteId];

    return (
        <svg viewBox={viewBox} {...props}>
            <use href={`#${id}`} />
        </svg>
    );
};

export default SpriteIcon;
