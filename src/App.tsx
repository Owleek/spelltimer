// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import Welcome from './screens/welcome/Welcome';
import Activity from './screens/activity/Activity';
import Constructor from './screens/activity/Constructor';


const App = () => {
    return (
        <Routes>
            <Route index element={<Welcome />}/>    
            <Route path="activities" element={<Activity />}>
                <Route path='constructor' element={<Constructor onChange={() => console.log('.')} />}>
                    <Route path='spels' element={<React.Fragment><i className="tileGrid__item" /><i className="tileGrid__item" /><i className="tileGrid__item" /><i className="tileGrid__item" /><i className="tileGrid__item" /><i className="tileGrid__item" /><i className="tileGrid__item" /></React.Fragment>} />
                    <Route path='items' element={<React.Fragment><i className="tileGrid__item" /><i className="tileGrid__item" /><i className="tileGrid__item" /></React.Fragment>} />
                    <Route path='other' element={<React.Fragment><i className="tileGrid__item" /></React.Fragment>} />
                </Route>
            </Route>
        </Routes>
    )
};

export default App;