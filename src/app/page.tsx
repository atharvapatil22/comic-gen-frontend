"use client";

import { useEffect, useState } from "react";
import Loader from "./components/Loader";

export default function Home() {
  const [userInput, setUserInput] = useState("");

  const [showSnackbar, setShowSnackbar] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const [comicPages, setComicPages] = useState<string[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState("custom");

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/test-connection`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("API Success:", data);
        setShowSnackbar("Backend Server Spun Up!✅");
        setTimeout(() => setShowSnackbar(""), 3000);
      } else {
        console.log("API ERROR:", data);
      }
    } catch (error) {
      console.error("NETWORK ERROR:", error);
      setShowSnackbar("Network Error occurred!");
      setTimeout(() => setShowSnackbar(""), 3000);
    }
  };

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      setShowSnackbar("Please enter a valid recipe before generating!");
      setTimeout(() => setShowSnackbar(""), 3000);

      return;
    }

    console.log("Calling the '/run_crew' API");
    setShowLoader(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/run_crew`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input_text: userInput }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("API Success:", data);
        setComicPages(data.res);
      } else if (response.status >= 400 && response.status < 500) {
        console.log("CLIENT ERROR:", data);
        setShowSnackbar(data.message);
        setTimeout(() => setShowSnackbar(""), 3000);
      } else if (response.status >= 500 && response.status < 600) {
        console.log("SERVER ERROR:", data);
        setShowSnackbar(data.message);
        setTimeout(() => setShowSnackbar(""), 3000);
      }
    } catch (error) {
      console.error("NETWORK ERROR:", error);
      setShowSnackbar("Network Error occurred!");
      setTimeout(() => setShowSnackbar(""), 3000);
    }
    setShowLoader(false);
  };

  return (
    <main className="min-h-screen flex flex-col ">
      <div
        className="absolute inset-0 bg-[url('/app_bg.png')] bg-cover bg-center opacity-70  -z-10"
        // style={{ filter: "blur(2px)" }}
      />
      <nav className="w-full h-[70px] flex items-center justify-between px-6 border-b-4 shadow-sm bg text-black bg-gray-100 ">
        <h1 className="text-xl font-semibold ">Recipe Comic Generator</h1>
        <button
          className="text-2xl focus:outline-none"
          onClick={() => {
            // no action for now
          }}
        >
          &#9776; {/* Unicode hamburger symbol */}
        </button>
      </nav>

      {/* Home page content */}
      <div className="home-wrapper flex flex-1">
        {/* User input section */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-[70%] h-[90%] border-4 border-black bg-gray-100  text-black p-4 flex flex-col">
            <h2 className="text-2xl font-semibold">Enter your recipe</h2>

            <div>
              {/* Tab Headers */}
              <div className="flex space-x-4 border-b-2 border-black mt-4">
                <button
                  onClick={() => setSelectedTab("custom")}
                  className={` px-4 py-2 rounded-t-md cursor-pointer ${
                    selectedTab === "custom"
                      ? "bg-white border-2 border-black border-b-0 font-medium"
                      : "hover:bg-gray-300"
                  }`}
                >
                  Custom Recipe
                </button>
                <button
                  onClick={() => setSelectedTab("ai")}
                  className={`px-4 py-2 rounded-t-md cursor-pointer ${
                    selectedTab === "ai"
                      ? "bg-white border-2 border-black border-b-0 font-medium"
                      : "hover:bg-gray-300"
                  }`}
                >
                  AI Generated Recipe
                </button>
              </div>

              {/* Tab Content */}
              <div className=" border-2 border-black border-t-0 bg-white h-[300px]">
                {selectedTab === "custom" && (
                  <div className="h-full">
                    <textarea
                      placeholder="Write your custom recipe here..."
                      className="w-full h-full resize-none  rounded p-2 focus:outline-none "
                    />
                  </div>
                )}
                {selectedTab === "ai" && (
                  <div>
                    {/* Replace with your AI recipe generation UI */}
                    <p>This is the AI generated recipe interface.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Comic Button */}
            <button className="mt-6 ml-auto px-6 py-2 bg-yellow-400 text-black  border-2 border-black rounded hover:bg-yellow-300 transition cursor-pointer">
              Generate Comic
            </button>
          </div>
        </div>

        {/* Comic poster section */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-[70%] h-[90%] border-4 border-black text-white bg-gray-100 justify-between">
            {showLoader ? (
              <div className="flex flex-col justify-center items-center h-[100%]">
                <h4 className="text-1xl font-semibold text-black">
                  Generating Comic
                </h4>
                <Loader />
              </div>
            ) : (
              <>
                {/* Top - Download Button */}
                {comicPages.length > 0 && (
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-white text-red-600 font-medium rounded hover:bg-gray-100 cursor-pointer">
                      Download Full Comic
                    </button>
                  </div>
                )}

                {/* Middle - Image or Empty */}
                <div className="flex-1 flex justify-center items-center">
                  {comicPages.length === 0 ? (
                    <p className="text-xl italic text-black">empty</p>
                  ) : (
                    <img
                      src={`data:image/png;base64,${comicPages[currentPageIndex]}`}
                      alt={`Comic ${currentPageIndex + 1}`}
                      className="max-h-[100%] aspect-[3/4] object-contain rounded shadow-md"
                    />
                  )}
                </div>

                {/* Bottom - Navigation */}
                {comicPages.length > 0 && (
                  <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                      className="text-2xl px-3 py-1 bg-white text-red-600 rounded hover:bg-gray-100"
                      onClick={() =>
                        setCurrentPageIndex((prev) => Math.max(prev - 1, 0))
                      }
                      disabled={currentPageIndex === 0}
                    >
                      ←
                    </button>
                    <span className="text-lg">{`${currentPageIndex + 1} / ${
                      comicPages.length
                    }`}</span>
                    <button
                      className="text-2xl px-3 py-1 bg-white text-red-600 rounded hover:bg-gray-100"
                      onClick={() =>
                        setCurrentPageIndex((prev) =>
                          Math.min(prev + 1, comicPages.length - 1)
                        )
                      }
                      disabled={currentPageIndex === comicPages.length - 1}
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Snackbar */}
        {!!showSnackbar && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-md">
            {showSnackbar}
          </div>
        )}
      </div>
    </main>
  );
}
