// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { JSX, useState } from 'react';
import cn from 'classnames';
import './activity.scss';

const translate = (key: string): string => {
  return key;
}

interface IProps {
  onChange: () => any;
}

type ItabKeys = 'all' | 'spels' | 'items' | 'other';
type ItabItem = { key: ItabKeys, title: string };
type ITabs = ItabItem[];

const tabs: ITabs = [
  {
    key: 'all',
    title: translate('all')
  },
  {
    key: 'spels',
    title: translate('spels')
  },
  {
    key: 'items',
    title: translate('items')
  },
  {
    key: 'other',
    title: translate('other')
  }
];

const Constructor = (props: IProps) => {
  const [activeTab, setActiveTab] = useState<ItabKeys>(tabs[0].key);

  const renderSpels = (): JSX.Element | null => {
    const items = ['Blackhole', 'Choronosphere', 'Ravage', 'Supernova', 'metamorphosis'];
    return <React.Fragment><i/><i/><i/></React.Fragment>;
  }

  const renderItems = (): JSX.Element | null => {
    const items = ['aeondisk', 'blackkingbar', 'refresher'];
    return <React.Fragment><i/><i/></React.Fragment>;
  }

  const renderOther = (): JSX.Element | null => {
    const items = ['buyback', 'glyphoffortification', 'tormentor'];
    return <i/>;
  }

  const renderAbilities = (): JSX.Element | null => {
    return <React.Fragment><i/><i/><i/><i/><i/><i/></React.Fragment>;
  }


  const renderContent = () => {

    switch(activeTab) {
      case 'spels': 
        return renderSpels()
      case 'items': 
        return renderItems()
      case 'other': 
        return renderOther()
      default:
        return renderAbilities()
    }
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
                      tabs.map(el => 
                      <li key={el.key} className={cn('Menu__item', {active: el.key === activeTab})} onClick={() => setActiveTab(el.key)}>
                        <div className="Menu__tile img-abilities"><span>{el.title}</span></div>
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
            <input type='text' className="searh" />
            <div className="tileGrid">
              { renderContent() }
            </div>
          </div>
        </div>
    </React.Fragment>
  )
}

export default Constructor;