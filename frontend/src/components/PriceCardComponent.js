import React from 'react';
import TitleComponent from './TitleComponent';
import PriceComponent from './PriceComponent';
import FeatureComponent from './FeatureComponent';

const PriceCardComponent = ({
    key,
    PriceCardsIndex,
    titleName,
    headingColor,
    captionName,
    prefix,
    amount,
    postfix,
    currency,
    features,
    newFeature,
    onAddFeature,
    onNewFeatureChange,
    onFeatureChange,
    onRemoveFeature,
    style
}) => {
    return (
        <div style={{ ...style, margin: '0 10px' }}>
            {/* Render the Price Card UI using the provided props */}
            <TitleComponent 
                title={titleName}
                color={headingColor}
                subtitle={captionName}
            />
            <PriceComponent
                prefix={prefix}
                amount={amount}
                postfix={postfix}
                currency={currency}
                className="my-4"
            />
            <FeatureComponent
                features={features}
                newFeature={newFeature}
                onAddFeature={onAddFeature}
                onNewFeatureChange={onNewFeatureChange}
                onFeatureChange={onFeatureChange}
                onRemoveFeature={onRemoveFeature}
            />
        </div>
    );

};

export default PriceCardComponent;
