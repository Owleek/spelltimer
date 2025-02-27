import { makeSnakeCase } from '../utils/utils';

import spells from './spells.json';
import artifacts from './artifacts.json';
import features from './features.json';
import heroes from './heroes.json';

export interface IDataItem {
    id: string
    name: string
    img: string
    type: 'spells' | 'artifacts' | 'features' | 'heroes'
    cooldown: Array<number>
}

export interface ISpells extends IDataItem {
    __owner__: string
}

export interface IArtifacts extends IDataItem {
    owner: string | 'not set'
}

export type TMixedDataItem = ISpells | IArtifacts
export type TMixedData = Array<ISpells | IArtifacts | IDataItem>

const fillData = <T extends IDataItem>(arr: any): Array<T> => {

    return arr.map((item: { type: string; name: string; }, idx: number) => ({
        ...item,
        id: `${idx}-${item.type}-${item.name}`,
        img: `/assets/data_img/${item.type}/${makeSnakeCase(item.name)}.png`,
    }));
}

const _spellsData: Array<ISpells> = fillData(spells);
const _artifactsData: Array<IArtifacts> = fillData(artifacts);
const _featuresData: Array<IDataItem> = fillData(features);
const _heroesData: Array<IDataItem> = fillData(heroes);

const mixedData: TMixedData = [..._spellsData, ..._artifactsData, ..._featuresData, ..._heroesData];

export default mixedData;