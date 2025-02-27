import React, { useState, useRef, useEffect } from "react";
import './wheel.scss';

const numbers = Array.from({ length: 100000 }, (_, i) => i + 1); // 1-100000

const Wheel = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [offset, setOffset] = useState(0);
    const isDragging = useRef(false);
    const startY = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        startY.current = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        const delta = e.clientY - startY.current;
        setOffset(delta);
    };

    const handleMouseUp = () => {
        if (Math.abs(offset) > 30) {
        // Если дельта больше 30px — смена числа
        setCurrentIndex((prev) =>
            offset > 0 ? Math.max(prev - 1, 0) : Math.min(prev + 1, numbers.length - 1)
        );
        }
        setOffset(0);
        isDragging.current = false;
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        
        if (timeoutRef.current) clearTimeout(timeoutRef.current); // Очищаем прошлые таймеры
        setOffset(e.deltaY > 0 ? 30 : -30); // Добавляем смещение в сторону скролла

        timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) =>
            e.deltaY > 0 ? Math.min(prev + 1, numbers.length - 1) : Math.max(prev - 1, 0)
        );
        setOffset(0); // После изменения числа сбрасываем смещение
        }, 10); // Таймер для плавного обновления индекса
    };


    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

  return (
    <div className="wheel-container" onMouseDown={handleMouseDown} onWheel={handleWheel}>

      <div className="number prev" style={{ transform: `translateY(${offset}px)` }}>{numbers[currentIndex - 1] ?? ""}</div>

      <div className="number current" style={{ transform: `translateY(${offset}px)` }}>
        {numbers[currentIndex]}
      </div>

      <div className="number next" style={{ transform: `translateY(${offset}px)` }}>{numbers[currentIndex + 1] ?? ""}</div>

    </div>
  );
};

export default Wheel;