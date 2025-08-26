"use client";

import Header from "./components/Header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col relative">
      <div className="mb-2">
        <Header />
      </div>
      <div className="flex flex-row absolute top-16 w-full">
        <h1>Welcome to Coin Tracker</h1>
      </div>
    </div>
  );
}
