// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React from 'react';
import { Routes, Route, NavLink, Outlet } from 'react-router-dom';
import './activity.scss';

interface IProps {
  onChange: () => any;
}

const Constructor = (props: IProps) => {

  return (
    <React.Fragment>
        <div className="layout has-sidebar fixed-sidebar fixed-header">
          <aside id="sidebar" className="sidebar break-point-sm has-bg-image">
            <div className="sidebar-layout">
              <div className="sidebar-content">
                <nav className="menu open-current-submenu">
                  <ul>
                    <li className="Menu__item">
                      <NavLink to="spels">
                        <div className="Menu__tile img-abilities">
                          <span>SPELS</span>
                        </div>
                      </NavLink>
                    </li>
                    <li className="Menu__item">
                      <NavLink to="items">
                        <div className="Menu__tile img-items">
                          <span>ITEMS</span>
                        </div>
                      </NavLink>
                    </li>
                    <li className="Menu__item">
                      <NavLink to="other">
                        <div className="Menu__tile img-other">
                          <span>OTHER</span>
                        </div>
                      </NavLink>
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
              <Outlet />
            </div>
          </div>
        </div>
    </React.Fragment>
  )
}

export default Constructor;