import React from 'react';

interface IProps {
    message: string;
}

const ErrorComponent = ({ message }: IProps) => {
    return (
        <div style={{ color: 'red', padding: '20px' }}>
            Error: {message}
        </div>
    );
}

export default ErrorComponent;

