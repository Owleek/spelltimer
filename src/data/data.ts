import { makeSnakeCase } from '../utils/utils';

import spells from './spells.json';
import artifacts from './artifacts.json';
import features from './features.json';
import reducers from './reducers.json';
import heroes from './heroes.json';

export enum EAbility {
    SPELLS = 'spells',
    ARTIFACTS = 'artifacts',
    FEATURES = 'features',
    REDUCERS = 'reducers',
    HEROES = 'heroes'
}

export interface IBaseFields {
    id: string
    key: string
    name: string
    img: string
    type: EAbility
}

export interface IRequiredFields extends IBaseFields {
    cooldown: Array<number>
    initialCooldown: Array<number>
    cooldownIndex: number
    customCooldown: number | null
    position: number
    boundKey: string
}

export interface IReducer extends IBaseFields {
    percent: number
}

export interface IHeroes extends IBaseFields {}

export interface ISpell extends IRequiredFields {
    reducers: Array<string>
    hero: string
    siblings?: Array<string>
    upgradeByScepter?: Array<number>
    isUpgrade?: boolean
}

export interface IArtifact extends IRequiredFields {
    reducers: Array<string>
    owner: string | null
}

export interface IFeature extends IRequiredFields {
    owner?: string | null
}

export interface ITimerData extends IRequiredFields {
    reducers?: Array<{name: string, percent: number}>
    owner?: string | null
    hero?: string
    siblings?: Array<string>
    upgradeByScepter?: Array<number>
    isUpgrade?: boolean
}

const setBaseFields = <T>(arr: any, type: EAbility): Array<IBaseFields> => {
    return arr.map((item: IBaseFields, idx: number) => {
        const key = makeSnakeCase(item.name);

        return {
            ...item,
            id: `${idx}-${type}-${key}`,
            key: key,
            name: item.name,
            img: `/assets/${type}/${key}.webp`,
            type: type
        }
    })
}

const setRequredFields = <T>(arr: any): Array<IRequiredFields> => {
    return arr.map( (item: IRequiredFields) => {        
        return {
            ...item,
            initialCooldown: item.cooldown.slice(),
            cooldownIndex: 0,
            customCooldown: null,
            position: 0,
            boundKey: null
        }
    })
}

const heroesData: Array<IBaseFields> = setBaseFields(heroes, EAbility.HEROES);
const reducersData: Array<IReducer> = setBaseFields(reducers, EAbility.REDUCERS) as Array<IReducer>;

const spellsData: Array<ITimerData> = setRequredFields(setBaseFields(spells, EAbility.SPELLS)).map(item => ({...item, reducers: []}));
const artifactsData: Array<ITimerData> = setRequredFields(setBaseFields(artifacts, EAbility.ARTIFACTS)).map(item => ({...item, reducers: [], owner: null}));
const featuresData: Array<ITimerData> = setRequredFields(setBaseFields(features, EAbility.FEATURES));

export default { 
    heroes: heroesData,
    reducers: reducersData,
    spells: spellsData,
    artifacts: artifactsData,
    features: featuresData
}