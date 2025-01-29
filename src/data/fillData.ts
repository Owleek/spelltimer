import jsonData from './data.json';
import cloneDeep from 'lodash/cloneDeep';
import { makeSnakeCase } from '../utils/utils';


export interface IAbility {
    id: string,
    owner?: string,
    name: string,
    icon: string,
    image: string,
    cooldown: Array<number> | { min: number, max: number }
}

export interface IData {
    spells: Array<IAbility>,
    items: Array<IAbility>,
    other: Array<IAbility>
}

export default function(): {fullData: IData, plainData: Array<IAbility>} {

    const fullData: IData = cloneDeep(jsonData) as IData;

    (Object.keys(jsonData) as Array<keyof IData>).forEach((key, idx) => {
        fullData[key] = fullData[key].map((ability, abilityIdx) => (
            {
                ...ability,
                id: `${key}-${idx}-${abilityIdx}-${ability.name}`,
                icon: `/assets/${key}/${makeSnakeCase(ability.name)}.png`,
                image: `/assets/${key}/${makeSnakeCase(ability.name)}.png`,
            }
        ))
    });
    
    const plainData: Array<IAbility> = [];
    
    (Object.keys(fullData) as Array<keyof IData>).forEach(key => {
        plainData.push(...fullData[key].slice());
    });
    
    return {fullData, plainData}
}