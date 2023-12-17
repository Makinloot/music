import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SpotifyContext } from "../../context/SpotifyContext";
import { v4 as uuidv4 } from "uuid";
import noImg from "/no-img.png";
import Skeleton from "react-loading-skeleton";
import "./Categories.css";

const Categories = () => {
  const contextValues = SpotifyContext();
  const [categories, setCategories] = useState<
    SpotifyApi.CategoryObject[] | undefined
  >();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getCategories() {
      setLoading(true);
      try {
        const fetchedCategories = await contextValues?.spotify.getCategories({
          limit: 50,
        });
        const filterCategories = fetchedCategories?.categories.items.filter(
          (category) => category.name !== "Party" && category,
        );
        setCategories(filterCategories);
        setLoading(false);
      } catch (error) {
        console.log("error fetching categories: ", error);
      }
    }

    getCategories();
  }, [contextValues?.spotify]);

  return (
    <>
      <h3 className="mb-4 text-2xl">Browse by categories</h3>
      <div className="Search-categories">
        <div className="categories-container">
          {loading ? (
            <CategoryCardSkeleton />
          ) : (
            categories &&
            categories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))
          )}
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
        <h4 className="absolute left-[6px] top-[2px] w-[95%] truncate text-xl text-white">
          {name}
        </h4>
        <img src={icons[0].url} alt={name} />
      </div>
    </Link>
  );
};

const CategoryCardSkeleton = () => {
  const contextValues = SpotifyContext();
  // fake array for loading items
  const fakeArray = Array.from({ length: 20 }, () => ({}));
  return fakeArray.map(() => (
    <div key={uuidv4()} className="relative">
      <img src={noImg} className="opacity-0" />
      <Skeleton
        className="absolute inset-0"
        baseColor={`${contextValues?.darkMode ? "#202020" : "#eee"}`}
        highlightColor={`${contextValues?.darkMode ? "#444" : "#ffffff"}`}
      />
    </div>
  ));
};

export default Categories;
