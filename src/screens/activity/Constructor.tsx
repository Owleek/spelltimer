// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { useState } from 'react';
import cn from 'classnames';
import './activity.scss';
import Search from '../../components/Search/search';

const translate = (key: string): string => {
  return key;
}

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
  const [activeTab, setActiveTab] = useState<TabKey>(tabList[0].key);
  const [tabContent, setTabContent] = useState<TabContent>([{label: 'First Element', img: 'sds'}]);

  const contentObj: Partial<Record<TabKey, string>> = {};
  Object.keys(TabKey).forEach(key => contentObj[key as TabKey] = key);

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    
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
            <Search onChange={onSearch}/>
            <div className="tileGrid">
              <div style={{color: 'white', fontSize: '50px'}}>
                {contentObj[activeTab]}
              </div>
            </div>
          </div>
        </div>
    </React.Fragment>
  )
}

export default Constructor;