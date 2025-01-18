// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./screens/welcome/Welcome";
import Activity from "./screens/activity/Activity";


const App = () => {
    return (
        <Router>
            <div className="appContainer">
                <Routes>
                    <Route path="/" element={<Welcome />}></Route>
                    <Route path="/activities" element={<Activity />}></Route>
                </Routes>
            </div>
        </Router>
    );
};

export default App;