import React from 'react';

const PriceComponent = ({
  prefix = '',
  amount,
  postfix = '',
  currency = '$',
  discount = null,
  discountAmountStyle = 'text-xl font-semibold text-gray-900',
  originalAmountStyle = 'text-lg text-gray-400 line-through',
  prefixStyle = 'text-sm font-medium text-gray-500',
  postfixStyle = 'text-sm font-medium text-gray-500',
  currencyStyle = 'text-lg font-semibold text-gray-900',
  amountStyle = 'text-3xl font-extrabold text-blue-600',
  containerStyle = 'flex items-baseline justify-center space-x-2',
}) => {
  const hasDiscount = discount !== null;

  // instead of false use hasDiscount in line 22
  return (
    <div className={containerStyle}>
      {false && (
        <span className={originalAmountStyle}>
          {prefix && <span className={prefixStyle}>{prefix}</span>}
          {currency && <span className={currencyStyle}>{currency}</span>}
          <span>{amount}</span>
          {postfix && <span className={postfixStyle}>{postfix}</span>}
        </span>
      )}
      <div className="flex items-baseline">
        {prefix && <span className={prefixStyle}>{prefix}</span>}
        {currency && <span className={currencyStyle}>{currency}</span>}
        <span className={amountStyle}>{hasDiscount ? discount : amount}</span>
        {postfix && <span className={postfixStyle}>{postfix}</span>}
      </div>
    </div>
  );
};

export default PriceComponent;
