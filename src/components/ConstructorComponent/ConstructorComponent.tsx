// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import Search from '../Search/Search';
import ImageGrid from '../ImageGrid/ImageGrid';
import fetchData, { IRequiredFields, ITimerData } from '../../data/data';
import { translate } from '../../utils/utils';
import { ISlot } from '../../store/slotSlice';

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
  const { spells, artifacts, features } = fetchData;
  const unionData: Array<ITimerData> = [...spells, ...artifacts, ...features];

  const [activeTab, setActiveTab] = useState<TabKey>(tabList[0].key);
  const [tabContent, setTabContent] = useState<ITimerData[]>(unionData);
  const [searchValue, setSearchValue] = useState<string>('');

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

  return (
    <React.Fragment>
        <div className="layout has-sidebar fixed-sidebar fixed-header">
          <aside id="sidebar" className="sidebar break-point-sm has-bg-image">
            <div className="sidebar-layout">
              <div className="sidebar-content">
                <nav className="menu open-current-submenu">
                  <ul>
                    {
                      tabList.map(el => 
                      <li key={el.key} className={cn('Menu__item', {active: el.key === activeTab})} onClick={() => setActiveTab(el.key)}>
                        <div className="Menu__tile img-abilities"><span>{el.label}</span></div>
                      </li>)
                    }
                  </ul>
                </nav>
                <div className="dotaButton" onClick={onCancel}>{translate('cancel')}</div>
              </div>
            </div>
          </aside>
        </div>
        <div className="overlay">
          <div className="overlay__workspace">
            <Search searchValue={searchValue} onSearch={onSearch} onBlur={onBlurSearch}/>
            <div className="tileGrid">
              <ImageGrid abilities={tabContent} onClick={onSelectAbility}/>
            </div>
          </div>
        </div>
    </React.Fragment>
  )
}

export default Constructor;