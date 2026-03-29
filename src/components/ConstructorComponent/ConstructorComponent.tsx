import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import Search from '../Search/Search';
import ImageGrid from '../ImageGrid/ImageGrid';
import fetchData, { ITimerData, IBaseFields } from '../../data/data';
import { addTyping, removeTyping} from '../../store/typingSlice';
import { translateText } from '../../utils/utils';
import { ISlot } from '../../store/slotSlice';
import {TStoreState} from '../../store/store';
import ProgressiveImage from './ProgressiveImage/ProgressiveImage';
import './ConstructorComponent.scss';
import SpriteIcon from '@shared/ui/SpriteIcon';

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

  const tabList: TabList = Object.keys(TabKey).map(key => (
    { key: key as TabKey, label: translateText(dictionary, key) })
  );

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
            <SpriteIcon id="components-constructorcomponent-constructorcomponent-1" />
          </span>
        </div>

        {
          itemOwnership &&
          <div className="Constructor__back" onClick={cancelArtifact} title={translateText(dictionary, 'cancel')}>
            <SpriteIcon id="components-constructorcomponent-constructorcomponent-2" />
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
                    { 
                      heroList.map(hero =>
                        <li key={hero.id} className="Sidebar__gridItem" onClick={() => handleClickHero(hero)}>
                          <ProgressiveImage img={hero.img} compressedImg={hero.compressedImg} altName={hero.name}/>
                        </li>
                      )
                    }
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