// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate} from 'react-router-dom';
import './activity.scss';

interface IProps {
  onChange: () => any;
}

const resolvePath = (url: string, arr: Array<string>): string => {
  let segments = url.split('/');

  while (!segments[segments.length - 1]) {
    segments.pop();
  }
  
  while (arr.includes(segments[segments.length - 1])) {
    segments.pop();
  }

  return segments.join('/');
}

const Constructor = (props: IProps) => {
  const url = useLocation().pathname;
  const navigate = useNavigate();
  const tabs: string[] = ['spels', 'items', 'other'];

  const handleClick = (path: string) => {
    const resolvedPath = resolvePath(url, tabs);
    const finalPath = `${resolvedPath}/${path}`;
    navigate(finalPath);
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
                      tabs.map(el => <li className="Menu__item">
                        <div className="Menu__tile img-abilities" onClick={() => handleClick(el)}>
                          <span>{el}</span>
                        </div>
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
              <Routes>
                <Route index element={<React.Fragment><i/><i/><i/><i/><i/><i/></React.Fragment>} />
                <Route path='spels' element={<React.Fragment><i/><i/><i/></React.Fragment>} />
                <Route path='items' element={<React.Fragment><i/><i/></React.Fragment>} />
                <Route path='other' element={<React.Fragment><i/></React.Fragment>} />
              </Routes>
            </div>
          </div>
        </div>
    </React.Fragment>
  )
}

export default Constructor;