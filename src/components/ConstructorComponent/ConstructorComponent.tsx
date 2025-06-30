import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import Search from '../Search/Search';
import ImageGrid from '../ImageGrid/ImageGrid';
import fetchData, { ITimerData, IBaseFields } from '../../data/data';
import { addTyping, removeTyping} from '../../store/typingSlice';
import { translateText } from '../../utils/utils';
import { ISlot } from '../../store/slotSlice';
import {TStoreState} from '../../store/store';
import './ConstructorComponent.scss';

enum TabKey {
  all = 'all',
  spells = 'spells',
  items = 'items',
  other = 'other'
};

type TabItem = { key: TabKey, label: string };
type TabList = Array<TabItem>;

interface IProps {
  onSelectAbility: (ability: ITimerData) => void
  onCancel: () => void
  currentSlot: ISlot
}

const Constructor = ({onSelectAbility, onCancel, currentSlot}: IProps) => {
  const TYPING_MAIN_ID = 'MainSearch';
  const TYPING_SIDE_ID = 'SideSearch';

  const {dictionary} = useSelector((state: TStoreState) => state.localeSlice);

  const tabList: TabList = Object.keys(TabKey).map(key => ({key: key as TabKey, label: translateText(dictionary, key)}));

  const dispatch = useDispatch();

  const { spells, artifacts, features, heroes } = fetchData;
  const unionData: Array<ITimerData> = [...spells, ...artifacts, ...features];

  const [activeTab, setActiveTab] = useState<TabKey>(tabList[0].key);
  const [tabContent, setTabContent] = useState<ITimerData[]>(unionData);
  const [heroList, setHeroList] = useState<IBaseFields[]>(heroes);
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

  const isMatchByShortName = (searchValue: string, nameArr: string[]) => {
    if (!nameArr.length || searchValue.length > nameArr.length) return false;
    return Array.prototype.every.call(searchValue, (char, idx) => char === nameArr[idx][0]);
  };

  const isIncludes = (inputValue: string, target: string): boolean => {
      const lowercasedTarget = target.toLocaleLowerCase();
      const splittedTarget = lowercasedTarget.split(' ');
      const simpleSearchTarget = lowercasedTarget.startsWith(inputValue);
      const chunkedSearchTarget = !!splittedTarget.find(substr => substr.startsWith(inputValue));
      const shortSearchTarget = isMatchByShortName(inputValue, splittedTarget);
      return simpleSearchTarget || chunkedSearchTarget || shortSearchTarget;      
  }

  const filterTabContent = (str: string, tab: TabKey): Array<ITimerData> => {
    const inputvalue = str.toLocaleLowerCase();
    
    return tabContentStructure[tab].filter(item => {      
      const nameIncludes = isIncludes(inputvalue, item.name);
      const heroIncludes = isIncludes(inputvalue, item.hero || '');
      return nameIncludes || heroIncludes;
    });
  }

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {    
    const value = event.target.value;
    setMainSearchValue(value);
    setTabContent(value ? filterTabContent(value, activeTab) : tabContentStructure[activeTab]);
  }

  const onChangeSideSearch = (event: React.ChangeEvent<HTMLInputElement>) => {    
    const value = event.target.value;
    const inputvalue = event.target.value.toLocaleLowerCase();

    const _filteredHeroes = heroes.filter(hero => isIncludes(inputvalue, hero.name));
    const filteredHeroes = value ? _filteredHeroes : heroes;

    setSideSearchValue(value);
    setHeroList(filteredHeroes);
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

  const clearSideSearch = () => {
    setSideSearchValue('');
    setHeroList(heroes);
  };

  const handleFocusMainSearch = () => {
    dispatch(addTyping({value: TYPING_MAIN_ID}));
  }

  const handleBlurMainSearch = () => {
    dispatch(removeTyping({value: TYPING_MAIN_ID}));
  }

  const handleFocusSideSearch = () => {
    dispatch(addTyping({value: TYPING_SIDE_ID}));
  }

  const handleBlurSideSearch = () => {
    dispatch(removeTyping({value: TYPING_SIDE_ID}));
  }

  const onSelectMenuItem = (key: TabKey) => {
      setActiveTab(key);
      setTabContent(mainSearchValue ? filterTabContent(mainSearchValue, key) : tabContentStructure[key]);
  }

  return (
    <div className="Constructor">
      <div className="Constructor__main">
        <div className="Constructor__searchWrapper">
          <Search searchValue={mainSearchValue} 
                  onChange={onChangeSearch} 
                  disabled={!!itemOwnership} 
                  onClickClear={clearMainSearch}
                  handleFocus={handleFocusMainSearch}
                  handleBlur={handleBlurMainSearch}/>
        </div>

        <div className="Constructor__body">
          <div className="Constructor__scrollContainer appStyledScroll">
            <ImageGrid abilities={tabContent} onClick={handleSelectItem} disableItemsExceptCurrent={itemOwnership}/>
          </div>
        </div>
      </div>

      <div className={cn('Sidebar', {absoluteOnMobile: !!itemOwnership})}>
        <div className="Constructor__close" onClick={onCancel} title={translateText(dictionary, 'close')}>
          <span className="Constructor__closeIcon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" >
              <path d="M43.7147 1.4392C44.8865 2.61075 44.8866 4.51047 43.7149 5.68212L29.0215 20.3748C27.8498 21.5464 27.8498 23.4459 29.0214 24.6175L43.7152 39.3113C44.8868 40.4829 44.8868 42.3824 43.7152 43.554L43.454 43.8152C42.2824 44.9868 40.3829 44.9868 39.2113 43.8152L24.5175 29.1214C23.3459 27.9498 21.4464 27.9498 20.2748 29.1215L5.58212 43.8149C4.41047 44.9866 2.51076 44.9865 1.3392 43.8147L1.07845 43.5539C-0.0928846 42.3823 -0.092807 40.483 1.07862 39.3116L15.772 24.6174C16.9435 23.4459 16.9435 21.5464 15.7719 20.3749L1.07896 5.68189C-0.0926111 4.51032 -0.0926088 2.61083 1.07896 1.43925L1.33925 1.17896C2.51083 0.00739199 4.41032 0.00739157 5.58189 1.17896L20.2749 15.8719C21.4464 17.0435 23.3459 17.0435 24.5174 15.872L39.2116 1.17862C40.383 0.00719345 42.2823 0.00711489 43.4539 1.17845L43.7147 1.4392Z" />
            </svg>
          </span>
        </div>

        {
          itemOwnership &&
          <div className="Constructor__back" onClick={cancelArtifact} title={translateText(dictionary, 'cancel')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 19">
              <path d="M3.62653 5.66667L6.02905 8.0819L4.68947 9.42857L0 4.71429L4.68947 0L6.02905 1.34667L3.62653 3.7619H10.4211C12.4311 3.7619 14.3589 4.56462 15.7802 5.99347C17.2015 7.42232 18 9.36025 18 11.381C18 13.4016 17.2015 15.3396 15.7802 16.7684C14.3589 18.1973 12.4311 19 10.4211 19H1.89474V17.0952H10.4211C11.9286 17.0952 13.3744 16.4932 14.4404 15.4216C15.5064 14.3499 16.1053 12.8965 16.1053 11.381C16.1053 9.86543 15.5064 8.41198 14.4404 7.34034C13.3744 6.26871 11.9286 5.66667 10.4211 5.66667H3.62653Z"/>
            </svg>
          </div>
        }

        { 
        itemOwnership && 
          <div className="Constructor__searchWrapper">
              <Search  searchValue={sideSearchValue} 
                        onChange={onChangeSideSearch} 
                        onClickClear={clearSideSearch}
                        handleFocus={handleFocusSideSearch} 
                        handleBlur={handleBlurSideSearch}/> 
          </div>
        }

        {  
          itemOwnership ?
            <div className="Sidebar__gridWrapper">
              <div className="Sidebar__scrollContainer appStyledScroll">
                <ul className="Sidebar__grid">
                  { heroList.map(hero => <li key={hero.id} className="Sidebar__gridItem" onClick={() => handleClickHero(hero)}><img src={hero.img} title={hero.name}/></li>) }
                </ul>
              </div>
            </div>
          : 
          <div className="MenuOuter">
            <div className="MenuScrollContainer appStyledScroll">
              <ul className="Menu">
                {
                  tabList.map(el => 
                  <li key={el.key} className={cn('Menu__item', {active: el.key === activeTab}, {[el.key]: el.key})} onClick={() => onSelectMenuItem(el.key)} title={el.label}>
                    <div className="Menu__text">{el.label}</div>
                    <div className={cn('Menu__picbox', {[el.key]: el.key})}></div>
                  </li>)
                }
              </ul>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Constructor;