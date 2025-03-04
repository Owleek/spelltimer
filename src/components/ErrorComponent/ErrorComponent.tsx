import React, { JSX } from 'react';

const ErrorComponent = ({message}:{message: string}): JSX.Element => {

    return <div>{message}</div>
}

export default ErrorComponent;