"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient"; // adjust path if needed

interface ComicModalProps {
  comicIds: string[];
  workloadId: string;
}

interface ComicData {
  id: string;
  reddit_url: string;
  preview_img_url: string;
}

export default function ComicSelectionModal({
  comicIds,
  workloadId,
}: ComicModalProps) {
  const [comics, setComics] = useState<ComicData[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!!comicIds) fetchSimilarComics();
  }, [comicIds]);

  const fetchSimilarComics = async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("comics")
      .select("id, reddit_url, preview_img_url")
      .in("id", comicIds);

    if (error) {
      console.error("Error fetching similar comics:", error);
    } else {
      setComics(data);
    }
  };

  const handleSelect = (id: string) => setSelected(id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-20 backdrop-blur-sm">
      <div className="bg-white p-6 max-w-5xl w-full mx-4 border-4 border-black bg-gray-100 text-black max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl text-center font-semibold">
          Found Similar Comics
        </h2>

        <h4 className="text-base sm:text-lg font-medium text-center mt-2 mb-6 max-w-2xl mx-auto">
          We found some comics in our database that might be similar. Select an
          existing comic if it matches your recipe, or choose the ‘Create New’
          option to generate a fresh one.
        </h4>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {comics.map((comic) => (
            <div
              key={comic.id}
              className={`rounded-lg overflow-hidden p-2 cursor-pointer border-3 w-60 sm:w-64 max-w-[10rem] flex flex-col relative ${
                selected === comic.id
                  ? "border-yellow-400"
                  : "border-transparent"
              }`}
              onClick={() => handleSelect(comic.id)}
              onDoubleClick={() => window.open(comic.reddit_url, "_blank")}
            >
              {/* Image container with top overlay */}
              <div className="w-full aspect-[4/7] relative group">
                <img
                  src={comic.preview_img_url}
                  alt="Comic preview"
                  className="w-full h-full object-contain rounded-md"
                />
                {/* Top overlay (20% height) */}
                <div
                  className="absolute top-0 left-0 w-full h-1/5 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm font-semibold rounded-t-md cursor-pointer transition-opacity opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card selection
                    window.open(comic.reddit_url, "_blank");
                  }}
                >
                  View Comic
                </div>
              </div>

              {/* Radio and Select */}
              <div className="flex justify-center mt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="comic-select"
                    checked={selected === comic.id}
                    onChange={() => handleSelect(comic.id)}
                  />
                  <span>Select</span>
                </label>
              </div>
            </div>
          ))}

          {/* "New" Card */}
          <div
            className={`rounded-lg overflow-hidden p-2 cursor-pointer border-3 w-60 sm:w-64 max-w-[10rem] flex flex-col items-center justify-center bg-gray-100 ${
              selected === "new" ? "border-yellow-400" : "border-transparent"
            }`}
            onClick={() => handleSelect("new")}
          >
            <div className="flex flex-col items-center justify-center h-48 w-full">
              <div className="text-4xl mb-2">➕</div>
              <div className="text-center font-medium">Create New</div>
            </div>
            <div className="flex justify-center mt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="comic-select"
                  checked={selected === "new"}
                  onChange={() => handleSelect("new")}
                />
                <span>Select</span>
              </label>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4 mt-4">
          <button
            className="px-4 py-2 rounded-md bg-red-500 text-white opacity-50 cursor-not-allowed"
            disabled
          >
            Cancel Workload
          </button>
          <button
            className={`px-4 py-2 rounded-md bg-yellow-400 text-white hover:bg-yellow-500 ${
              !selected ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!selected}
            onClick={() => console.log("Confirm choices clicked:", selected)}
          >
            Confirm Choices
          </button>
        </div>
      </div>
    </div>
  );
}
