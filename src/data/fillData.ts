import jsonData from './data.json';
import cloneDeep from 'lodash/cloneDeep';
import { makeSnakeCase } from '../utils/utils';

export interface IAbility {
    type: 'spells' | 'items' | 'other',
    id: string,
    owner?: string,
    name: string,
    icon: string,
    image: string,
    cooldown: Array<number> /*| { min: number, max: number }*/
}

export default function(): Array<IAbility> {
    let data: Array<IAbility> = cloneDeep(jsonData) as Array<IAbility>;

    data = data.map((ability, idx) => (
        {
            ...ability,
            id: `${idx}-${ability.type}-${ability.name}`,
            icon: `/assets/${ability.type}/${makeSnakeCase(ability.name)}.png`,
            image: `/assets/${ability.type}/${makeSnakeCase(ability.name)}.png`,
        }
    ));
    
    return data;
}