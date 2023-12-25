import React from "react";
import noImg from "/no-img.png";
import { Link } from "react-router-dom";

interface CardTypes {
  name: string;
  image: string;
  nameSecondary: string;
  url: string;
}

const Card: React.FC<CardTypes> = ({ name, image, nameSecondary, url }) => {
  return (
    <div className="Card select-none rounded-md">
      <div className="Card-img">
        <img
          className="max-h-[215px] w-full max-w-[215px] rounded-md object-cover"
          src={image || noImg}
          alt={name}
        />
      </div>
      <div className="my-2">
        <h3 className="truncate text-base">{name}</h3>
        <Link to={url} className="truncate opacity-70 hover:underline">
          {nameSecondary}
        </Link>
      </div>
    </div>
  );
};

export default Card;
