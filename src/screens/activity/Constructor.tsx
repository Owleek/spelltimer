// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import './activity.scss';
import Search from '../../components/Search/Search';
import ImageGrid from '../../components/ImageGrid/ImageGrid';
import getData from '../../data/fillData';
import {IAbility} from '../../data/fillData';
import { translate } from '../../utils/utils';

interface IProps {
  onChange: () => any;
}

enum TabKey {
  all = 'all',
  spells = 'spells',
  items = 'items',
  other = 'other'
};

type TabItem = { key: TabKey, label: string };
type TabList = Array<TabItem>;
type TabContent = Array<{label: string, img: any}>;
const tabList: TabList = Object.keys(TabKey).map(key => ({key: key as TabKey, label: translate(key)}));

const Constructor = (props: IProps) => {
  const data: Array<IAbility> = getData();

  const [activeTab, setActiveTab] = useState<TabKey>(tabList[0].key);
  const [tabContent, setTabContent] = useState<IAbility[]>(data);
  const [searchValue, setSearchValue] = useState<string>('');

  const spells = data.filter(ability => ability.type === "spells");
  const items = data.filter(ability => ability.type === "items");
  const other = data.filter(ability => ability.type === "other");

  const tabContentStructure = {all: data, spells, items, other};

  useEffect(() => {
    setTabContent(tabContentStructure[activeTab]);
  }, [activeTab]);

  const filterTabContent = (str: string): Array<IAbility> => {
    return tabContentStructure[activeTab].filter(ability => ability.name.toLowerCase().startsWith(str));
  }

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {    
    const value = event.target.value;
    setSearchValue(value);
    setTabContent(value ? filterTabContent(value) : tabContentStructure[activeTab]);
  }

  const onBlurSearch = (event: React.FocusEvent<HTMLInputElement>) => {
    setSearchValue('');
    setTabContent(tabContentStructure[activeTab]);
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
                <div className="dotaButton" onClick={props.onChange}>Сохранить</div>
              </div>
            </div>
          </aside>
        </div>
        <div className="overlay">
          <div className="overlay__workspace">
            <Search searchValue={searchValue} onSearch={onSearch} onBlur={onBlurSearch}/>
            <div className="tileGrid">
              <ImageGrid abilities={tabContent}/>
            </div>
          </div>
        </div>
    </React.Fragment>
  )
}

export default Constructor;