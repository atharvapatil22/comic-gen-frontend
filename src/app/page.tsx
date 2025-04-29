"use client";

import { useEffect, useState } from "react";
import Loader from "./components/Loader";

export default function Home() {
  const [userInput, setUserInput] = useState("");

  const [showSnackbar, setShowSnackbar] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const [comicPages, setComicPages] = useState<string[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

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
      <div className="absolute inset-0 bg-[url('/app_bg.png')] bg-cover bg-center opacity-70  -z-10" style={{filter: 'blur(2px)'}} />
      <nav className="w-full h-[70px] flex items-center justify-between px-6 border-b-4 shadow-sm bg bg-[#edc032] text-black">
        <h1 className="text-xl font-semibold">Recipe Comic Generator</h1>
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
        <div className="w-1/2 flex flex-col justify-center items-center gap-4 p-18">
          <h2 className="text-3xl font-semibold self-start">
            Enter your recipe
          </h2>

          <textarea
            placeholder="Enter your recipe..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            rows={12}
            className="w-1/1 border border-gray-300 rounded resize-none overflow-y-auto p-2 focus:outline-none"
          />

          <div className="w-1/1 flex justify-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
              onClick={handleGenerate}
            >
              Generate
            </button>
          </div>
        </div>

        {/* Comic poster section */}
        <div className="w-1/2 bg-yellow-200 text-white flex flex-col justify-between p-2 my-8 mx-30 border-4 border-black">
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
