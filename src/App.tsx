// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.

import { useState } from "react";
import Welcome from "./screens/welcome/Welcome";
import Activity from "./screens/activity/Activity";


const App = () => <div className="appContainer">
    {/* <Welcome /> */}
    <Activity />
</div>;

export default App;