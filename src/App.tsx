// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Welcome from './screens/welcome/Welcome';
import Activity from './screens/activity/Activity';

const App = () => {
    return (
        <Routes>
            <Route index element={<Welcome />}/>    
            <Route path="activities/*" element={<Activity />} />
        </Routes>
    )
};

export default App;