import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SpotifyContext } from "../../context/SpotifyContext";
import "./Categories.css";

const Categories = () => {
  const contextValues = SpotifyContext();
  const [categories, setCategories] = useState<
    SpotifyApi.CategoryObject[] | undefined
  >();

  useEffect(() => {
    async function getCategories() {
      try {
        const fetchedCategories = await contextValues?.spotify.getCategories({
          limit: 50,
        });
        const filterCategories = fetchedCategories?.categories.items.filter(
          (category) => category.name !== "Party" && category,
        );
        setCategories(filterCategories);
      } catch (error) {
        console.log("error fetching categories: ", error);
      }
    }

    getCategories();
  }, [contextValues?.spotify]);

  return (
    <>
      <h3 className="mb-4 text-2xl">Browse by categories</h3>
      <div className="Search-categories h-[84%] overflow-scroll overflow-x-hidden pb-5 pr-2">
        <div className="categories-container">
          {categories &&
            categories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
        </div>
      </div>
    </>
  );
};

const CategoryCard: React.FC<{
  icons: SpotifyApi.ImageObject[];
  id: string;
  name: string;
}> = ({ icons, id, name }) => {
  return (
    <Link to={`/genre/${id}`}>
      <div className="relative">
        <h4 className="absolute left-[6px] top-[2px] text-xl text-white">
          {name}
        </h4>
        <img src={icons[0].url} alt={name} className="" />
      </div>
    </Link>
  );
};

export default Categories;
