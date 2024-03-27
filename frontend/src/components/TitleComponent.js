import React from 'react';

const TitleComponent = ({
  title,
  subtitle = '',
  color,
  titleStyle = 'text-2xl font-bold text-gray-800',
  subtitleStyle = 'text-md text-gray-500',
  containerStyle = 'text-center mb-4',
}) => {


  const dynamicTitleStyleInline = color ? { color } : {};
  const dynamicSubtitleStyleInline = color ? { color } : {};

  return (
    <div className={containerStyle}>
      <h1 className={titleStyle} style={dynamicTitleStyleInline}>{title}</h1>
      {subtitle && <p className={subtitleStyle} style={dynamicSubtitleStyleInline}>{subtitle}</p>}
    </div>
  );
};

export default TitleComponent;
