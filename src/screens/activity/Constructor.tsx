// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React from 'react';
import { Routes, Link, Route } from 'react-router-dom';
import './activity.scss';

interface IProps {
  onChange: () => any;
}

const Constructor = (props: IProps) => <React.Fragment>
    <div className="layout has-sidebar fixed-sidebar fixed-header">
      <aside id="sidebar" className="sidebar break-point-sm has-bg-image">
        <div className="sidebar-layout">
          <div className="sidebar-content">
            <nav className="menu open-current-submenu">
              <ul>
                <li className="Menu__item">
                  {/* <Link to="/activities/spels"> */}
                    <div className="Menu__tile img-abilities">
                      <span>SPELS</span>
                    </div>
                  {/* </Link> */}
                </li>
                <li className="Menu__item">
                  {/* <Link to="/activities/items"> */}
                    <div className="Menu__tile img-items">
                      <span>ITEMS</span>
                    </div>
                  {/* </Link> */}
                </li>
                <li className="Menu__item">
                  {/* <Link to="/activities/other"> */}
                    <div className="Menu__tile img-other">
                      <span>OTHER</span>
                    </div>
                  {/* </Link> */}
                </li>
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
          <Routes>
            <Route path="spels" element={<React.Fragment>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            <i className="tileGrid__item"></i>
            </React.Fragment>} />
          </Routes>
        </div>
      </div>
    </div>
</React.Fragment>

export default Constructor;