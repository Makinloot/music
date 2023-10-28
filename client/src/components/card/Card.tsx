import React from "react";

const Card: React.FC = () => {
  return (
    <div className="Card rounded-md p-2">
      {/* <div className="Card max-w-[170px] rounded-md p-2"> */}
      <div className="Card-img">
        <img
          className="max-h-[170px] w-full object-cover"
          src="https://picsum.photos/200/300"
          alt="alt"
        />
      </div>
      <h3>Radiohead</h3>
      <h5>OK Computer OKNOT</h5>
    </div>
  );
};

export default Card;
