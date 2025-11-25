'use client';
import React from 'react';
import cn from 'classnames';

interface IProps {
    deeplink: string
    link?: string
    children: React.ReactNode
    className?: string
}

const Social = ({deeplink, link, children, className}: IProps) => {

  const handleClick = () => {
      return !!link ? openWithFallback() : justOpen();
  };

  const openWithFallback = () => {
    if (!link) return;

    const timeout = setTimeout(() => {
      window.location.href = link;
    }, 1500);

    window.location.href = deeplink;

    window.addEventListener("blur", () => clearTimeout(timeout), { once: true });
  }

  const justOpen = () => {
    window.location.href = deeplink;
  }


  return <span className={cn(className)} onClick={handleClick}>{children}</span>
};

export default Social;

