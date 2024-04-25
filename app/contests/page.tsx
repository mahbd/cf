"use client";

import { useEffect, useState } from "react";
import { categories } from "./constants";
import CFTable from "./CFTable";
import { SearchInput, CfUser } from "@/components";

export default function Contests() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [filter, setFilter] = useState("");
  const [contestList, setContestList] = useState([]);

  useEffect(() => {
    fetch("https://codeforces.com/api/contest.list?gym=false")
      .then((res) => res.json())
      .then((data) => {
        setContestList(data.result);
        console.log(data.result);
      });
  }, []);

  const getCategoryText = (category: string) => {
    return categories[category].search;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-light" id="codeforces">
        <div className="row mx-0">
          <div className="col-lg-2 col-md-3 mx-0 px-0 py-2 border-right codeforces-sidebar">
            <div className="sidebar px-2">
              <div>
                <SearchInput
                  search={search}
                  handleChange={(e) => setSearch(e.target.value)}
                />

                <div className="form-group">
                  <label>Category </label>
                  <select
                    className="form-control form-control-sm"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {Object.keys(categories).map((categoryOption) => (
                      <option
                        key={categoryOption}
                        value={categories[categoryOption].value}
                      >
                        {categories[categoryOption].name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label> Filter</label>
                  <select
                    className="form-control form-control-sm"
                    name="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value=""> All</option>
                    <option value="1"> Attempted</option>
                    <option value="0"> Not Attempted</option>
                  </select>
                </div>
              </div>
              <CfUser />
              <hr />
            </div>
          </div>

          <div className="content-box col-lg-10 col-md-9 mx-0 px-1 px-md-2 ">
            <CFTable
              contestList={contestList}
              searchCategory={getCategoryText(category)}
              search={search}
              filter={filter}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
