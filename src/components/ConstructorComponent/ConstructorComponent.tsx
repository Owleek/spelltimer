// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import Search from '../Search/Search';
import ImageGrid from '../ImageGrid/ImageGrid';
import fetchData, { IRequiredFields, ITimerData, IBaseFields } from '../../data/data';
import { EAbility } from '../../data/data';
import { translate } from '../../utils/utils';
import { ISlot } from '../../store/slotSlice';
import './ConstructorComponent.scss';

enum TabKey {
  all = 'all',
  spells = 'spells',
  items = 'items',
  other = 'other'
};

type TabItem = { key: TabKey, label: string };
type TabList = Array<TabItem>;
const tabList: TabList = Object.keys(TabKey).map(key => ({key: key as TabKey, label: translate(key)}));

interface IProps {
  onSelectAbility: (ability: ITimerData) => void
  onCancel: () => void
  currentSlot: ISlot
}

const Constructor = ({onSelectAbility, onCancel, currentSlot}: IProps) => {
  const { spells, artifacts, features, heroes } = fetchData;
  const unionData: Array<ITimerData> = [...spells, ...artifacts, ...features];

  const [activeTab, setActiveTab] = useState<TabKey>(tabList[0].key);
  const [tabContent, setTabContent] = useState<ITimerData[]>(unionData);
  const [searchValue, setSearchValue] = useState<string>('');
  const [artifact, setArtifact] = useState<ITimerData | null>(null);
  const [hero, setHero] = useState<IBaseFields | null>(null);

  const tabContentStructure = {all: unionData, spells: spells, items: artifacts, other: features};

  useEffect(() => {
    setTabContent(tabContentStructure[activeTab]);
  }, [activeTab]);

  const filterTabContent = (str: string): Array<ITimerData> => {
    return tabContentStructure[activeTab].filter(ability => ability.name.toLowerCase().startsWith(str));
  }

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {    
    const value = event.target.value;
    setSearchValue(value);
    setTabContent(value ? filterTabContent(value) : tabContentStructure[activeTab]);
  }

  const onBlurSearch = (event: React.FocusEvent<HTMLInputElement>) => {

  }

  const handleSelectItem = (item: ITimerData) => {
    if (item.type !== EAbility.ARTIFACTS) return onSelectAbility(item);
    setArtifact(item);
  }

  const handleClickHero = (hero: IBaseFields) => {
    if (!artifact) return;
    const modifiedArtifact = {...artifact, id: artifact.id + hero.name, owner: hero.name};
    onSelectAbility(modifiedArtifact);
  }

  const cancelArtifact = () => setArtifact(null);

  return (
    <div className="Constructor">
      <div className="Constructor__main">
        <div className="Constructor__head">
          <Search searchValue={searchValue} onSearch={onSearch} onBlur={onBlurSearch} disabled={!!artifact}/>
        </div>
        <div className="Constructor__body">
          <div className="Constructor__bodyFrame">
            <ImageGrid abilities={tabContent} onClick={handleSelectItem} disableItemsExceptCurrent={artifact}/>
          </div>
        </div>
      </div>
      
      {
        artifact ? 
        <div className="Sidebar">
          <div className="Sidebar__head">
            <Search searchValue={''} onSearch={() => null} onBlur={() => null}/>
          </div>
          <div className="Sidebar__grid">
            { heroes.map(hero => <div key={hero.id} className="Sidebar__gridItem" onClick={() => handleClickHero(hero)}><img src={hero.img}/></div>) }
          </div>
          <button className="Sidebar__button" onClick={cancelArtifact}>{translate('cancel')}</button>
        </div>
        :
        <div className="Sidebar">
          <ul className="Menu">
            {
              tabList.map(el => 
              <li key={el.key} className={cn('Menu__item', {active: el.key === activeTab})} onClick={() => setActiveTab(el.key)}>
                <div className="Menu__tile img-abilities"><span>{el.label}</span></div>
              </li>)
            }
          </ul>
          <button className="Sidebar__button" onClick={onCancel}>{translate('cancel')}</button>
        </div>
      }
    </div>
  )
}

export default Constructor;