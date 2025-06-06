"use client";

import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import { jsPDF } from "jspdf";

export default function Home() {
  const [customRecipe, setCustomRecipe] = useState("");
  const [dishName, setDishName] = useState("");
  const [aiRecipe, setAiRecipe] = useState("");

  const [showSnackbar, setShowSnackbar] = useState("");
  const [showComicLoader, setShowComicLoader] = useState(false);
  const [showRecipeLoader, setShowRecipeLoader] = useState(false);
  const [snackSuccess, setSnackSuccess] = useState(false);

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
        setSnackSuccess(true);
        setShowSnackbar("Backend Server Spun Up!✅");
        setTimeout(() => {
          setShowSnackbar("");
          setSnackSuccess(false);
        }, 3000);
      } else {
        console.log("API ERROR:", data);
      }
    } catch (error) {
      console.error("NETWORK ERROR:", error);
      setShowSnackbar("Network Error occurred!");
      setTimeout(() => setShowSnackbar(""), 3000);
    }
  };

  const handleGenerateRecipe = async () => {
    if (!dishName.trim()) {
      setShowSnackbar("Please enter a dish name before submitting!");
      setTimeout(() => setShowSnackbar(""), 3000);

      return;
    }

    console.log("Calling the '/generate-recipe' API");
    setShowRecipeLoader(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/generate-recipe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dish_name: dishName,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("API Success:", data);
        setAiRecipe(data.recipe);
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
    setShowRecipeLoader(false);
  };

  const handleGenerateComic = async () => {
    if (
      (selectedTab == "custom" && !customRecipe.trim()) ||
      (selectedTab == "ai" && !aiRecipe.trim())
    ) {
      setShowSnackbar("Please enter a recipe before submitting!");
      setTimeout(() => setShowSnackbar(""), 3000);

      return;
    }

    console.log("Calling the '/run-crew' API");
    setShowComicLoader(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/run-crew`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input_text: selectedTab == "custom" ? customRecipe : aiRecipe,
          }),
          // body: customRecipe,
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
    setShowComicLoader(false);
  };

  const downloadPDF = () => {
    if (comicPages.length === 0) {
      setShowSnackbar("No pages to download");
      setTimeout(() => setShowSnackbar(""), 3000);

      return;
    }
    const base64Images = comicPages;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [595.28, 841.89], // A4 size in points
    });

    base64Images.forEach((imgData, index) => {
      if (index !== 0) pdf.addPage();
      pdf.addImage(
        `data:image/png;base64,${imgData}`,
        "PNG",
        0,
        0,
        595.28,
        841.89
      );
    });

    pdf.save("comic.pdf");
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
              <div className=" border-2 border-black border-t-0 bg-white h-[350px]">
                {selectedTab === "custom" && (
                  <div className="h-full">
                    <textarea
                      placeholder="Write your custom recipe here..."
                      className="w-full h-full resize-none  rounded p-2 focus:outline-none "
                      value={customRecipe}
                      onChange={(e) => setCustomRecipe(e.target.value)}
                    />
                  </div>
                )}
                {selectedTab === "ai" && (
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        value={dishName}
                        onChange={(e) => setDishName(e.target.value)}
                        placeholder="Name of any dish/meal"
                        className="w-[68%] outline-none p-2 text-base border border-gray-300 rounded"
                      />
                      {showRecipeLoader ? (
                        <Loader />
                      ) : (
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleGenerateRecipe();
                          }}
                          className="underline font-semibold text-base text-yellow-400 hover:text-yellow-500 rounded cursor-pointer text-center block"
                        >
                          Generate Recipe
                        </a>
                      )}
                    </div>

                    {!!aiRecipe && (
                      <div className="mt-4">
                        <p className="underline italic">Generated Recipe:</p>
                        <div className="overflow-y-scroll h-[220px] mt-2">
                          <p className="text-gray-700 whitespace-pre-line">
                            {aiRecipe}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Generate Comic Button */}
            <button
              className="mt-6 ml-auto px-6 py-2 bg-yellow-400 text-black  border-2 border-black rounded hover:bg-yellow-300 transition cursor-pointer"
              onClick={handleGenerateComic}
            >
              Generate Comic
            </button>
          </div>
        </div>

        {/* Comic poster section */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-[70%] h-[90%] border-4 border-black text-white bg-gray-100 justify-between ">
            {showComicLoader ? (
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
                  <div className="flex justify-center my-2">
                    <button
                      className="px-4 py-2 bg-yellow-400 text-black font-medium rounded hover:bg-white cursor-pointer"
                      onClick={downloadPDF}
                    >
                      Download Full Comic
                    </button>
                  </div>
                )}

                {/* Middle - Image or Empty */}
                <div className="flex-1 flex justify-center items-center ">
                  {comicPages.length === 0 ? (
                    <p className="text-xl italic text-gray-600 mt-40">
                      Generated comic will apear here
                    </p>
                  ) : (
                    <img
                      src={`data:image/png;base64,${comicPages[currentPageIndex]}`}
                      alt={`Comic ${currentPageIndex + 1}`}
                      className="max-h-[400px] w-auto object-contain rounded shadow-md"
                    />
                  )}
                </div>

                {/* Bottom - Navigation */}
                {comicPages.length > 0 && (
                  <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                      className="text-2xl px-3 py-1 bg-white bg-yellow-400 rounded hover:bg-white text-black cursor-pointer"
                      onClick={() =>
                        setCurrentPageIndex((prev) => Math.max(prev - 1, 0))
                      }
                      disabled={currentPageIndex === 0}
                    >
                      ←
                    </button>
                    <span className="text-lg text-black">{`${
                      currentPageIndex + 1
                    } / ${comicPages.length}`}</span>
                    <button
                      className="text-2xl px-3 py-1 bg-white bg-yellow-400 rounded hover:bg-white text-black cursor-pointer"
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
          <div
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 ${
              snackSuccess ? "bg-green-500" : "bg-red-500"
            } text-black px-4 py-2 rounded shadow-md`}
          >
            {showSnackbar}
          </div>
        )}
      </div>
    </main>
  );
}
//
