import React from "react";
import noImg from "/no-img.png";

interface CardTypes {
  name: string;
  image: string;
  nameSecondary: string;
}

const Card: React.FC<CardTypes> = ({ name, image, nameSecondary }) => {
  return (
    <div className="Card select-none rounded-md">
      {/* <div className="Card max-w-[170px] rounded-md p-2"> */}
      <div className="Card-img">
        <img
          className="max-h-[215px] w-full max-w-[215px] rounded-md object-cover"
          src={image || noImg}
          alt={name}
        />
      </div>
      <div className="my-2">
        <h3 className="truncate text-base">{name}</h3>
        <h5 className="truncate opacity-70">{nameSecondary}</h5>
      </div>
    </div>
  );
};

export default Card;
