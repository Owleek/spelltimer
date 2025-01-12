// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import './welcome.scss';

const Welcome = () => <div className="Welcome innerContainer">
    <h1 className="Welcome__title">На шаг впереди</h1>

    <button className="button">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Приступить
    </button>
</div>;

export default Welcome;