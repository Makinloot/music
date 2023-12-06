import { useState } from "react";
import { Input } from "antd";
import { IoSearch } from "react-icons/io5";
import Categories from "../components/categories/Categories";
import Collection from "../components/collection/Collection";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="Search h-full overflow-hidden">
      <div>
        <Input
          className="mb-2 h-[50px] border-2"
          placeholder={`Search music here...`}
          prefix={<IoSearch />}
          onChange={(e) => {
            const debouneTimer = setTimeout(() => {
              setSearchValue(e.target.value);
            }, 500);

            return () => clearTimeout(debouneTimer);
          }}
        />
      </div>
      {!searchValue ? (
        <Categories />
      ) : (
        <Collection type="search" searchValue={searchValue} />
      )}
    </div>
  );
};

export default Search;
