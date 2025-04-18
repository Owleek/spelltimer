// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  const [hero, setHero] = useState<IBaseFields | null>(null);
  const [mainSearchValue, setMainSearchValue] = useState<string>('');
  const [sideSearchValue, setSideSearchValue] = useState<string>('');
  const [itemOwnership, setItemOwnership] = useState<ITimerData | null>(null);


  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.code !== 'Escape') return;
    if (itemOwnership) return cancelArtifact();
    onCancel();
  }, [itemOwnership]);

  useEffect(()=> {
    document.addEventListener('keyup', handleEscape);
    return () => document.removeEventListener('keyup', handleEscape);
  }, [handleEscape]);


  const tabContentStructure = {all: unionData, spells: spells, items: artifacts, other: features};

  useEffect(() => {
    setTabContent(tabContentStructure[activeTab]);
  }, [activeTab]);

  const filterTabContent = (str: string): Array<ITimerData> => {
    return tabContentStructure[activeTab].filter(ability => ability.name.toLowerCase().startsWith(str));
  }

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {    
    const value = event.target.value;
    setMainSearchValue(value);
    setTabContent(value ? filterTabContent(value) : tabContentStructure[activeTab]);
  }

  const onChangeSideSearch = (event: React.ChangeEvent<HTMLInputElement>) => {    
    const value = event.target.value;
    setSideSearchValue(value);
  }

  const handleSelectItem = (item: ITimerData) => {
    if ('owner' in item) return setItemOwnership(item);
    onSelectAbility(item);
  }

  const handleClickHero = (hero: IBaseFields) => {
    if (!itemOwnership) return;
    const modifiedArtifact = {...itemOwnership, id: itemOwnership.id + hero.name, owner: hero.name};
    onSelectAbility(modifiedArtifact);
  }

  const cancelArtifact = () => setItemOwnership(null);

  const clearMainSearch = () => {
    setMainSearchValue('');
    setTabContent(tabContentStructure[activeTab]);
  }

  const clearSideSearch = () => setSideSearchValue('');

  return (
    <div className="Constructor">
      <div className="Constructor__main">
        <div className="Constructor__head">
          <Search searchValue={mainSearchValue} onChange={onChangeSearch} disabled={!!itemOwnership} onClickClear={clearMainSearch}/>
        </div>
        <div className="Constructor__body">
          <div className="Constructor__bodyFrame">
            <div className="Constructor__scrollContainer appscrollY">
              <ImageGrid abilities={tabContent} onClick={handleSelectItem} disableItemsExceptCurrent={itemOwnership}/>
            </div>
          </div>
        </div>
      </div>
      
      {
        itemOwnership ?
        <div className="Sidebar">
          <div className="Sidebar__head">
            <Search searchValue={sideSearchValue} onChange={onChangeSideSearch} onClickClear={clearSideSearch}/>
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