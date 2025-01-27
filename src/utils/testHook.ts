import React, { useEffect, useState } from 'react';


export default (): string => {
    const [justString, setJustString] = useState('first message ???');

    useEffect(() => {
        const timerId = setTimeout(() => setJustString('message after delay'), 3000);
    }, []);

    return justString;
}