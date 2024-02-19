import React from 'react';

const TitleComponent = ({
  title,
  subtitle = '',
  titleStyle = 'text-2xl font-bold text-gray-800',
  subtitleStyle = 'text-md text-gray-500',
  containerStyle = 'text-center mb-4',
}) => {
  return (
    <div className={containerStyle}>
      <h1 className={titleStyle}>{title}</h1>
      {subtitle && <p className={subtitleStyle}>{subtitle}</p>}
    </div>
  );
};

export default TitleComponent;
