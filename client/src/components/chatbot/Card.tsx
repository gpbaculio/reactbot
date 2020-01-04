import React from "react";

interface CardProps {
  image: {
    stringValue: string;
  };
  description: {
    stringValue: string;
  };
  header: {
    stringValue: string;
  };
  link: {
    stringValue: string;
  };
  price: {
    stringValue: string;
  };
}

const Card: React.FC<CardProps> = ({
  image,
  description,
  link,
  header,
  price
}) => (
  <div className="card w-100">
    <div className="card-image">
      <img alt="" src={image.stringValue} />
    </div>
    <div className="card-content">
      <p>{description.stringValue}</p>
      <p>{price.stringValue}</p>
    </div>
    <div className="card-action">
      <a target="_blank" rel="noopener noreferrer" href={link.stringValue}>
        View Product
      </a>
    </div>
  </div>
);

export default Card;
