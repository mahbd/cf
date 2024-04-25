"use client";

import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Homepage</h1>
    </main>
  );
}
