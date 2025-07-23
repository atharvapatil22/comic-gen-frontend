"use client";

import { getSupabaseClient } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

type ComicItem = {
  recipe_name: string;
  preview_image_url: string;
  comic_url: string;
  created_at: string;
};

export default function GalleryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [comicsList, setComicsList] = useState<ComicItem[]>([]);

  useEffect(() => {
    async function fetchComics() {
      console.log("DEB 1");
      const supabase = getSupabaseClient();

      console.log("DEB 2", supabase);

      setIsLoading(true);
      const { data, error } = await supabase
        .from("workloads")
        .select("id,created_at, recipe_name, preview_image_url, comic_url");

      if (error) {
        console.error("Error fetching comics:", error);
      } else {
        setComicsList(data);
      }
      setIsLoading(false);
    }

    fetchComics();
  }, []);

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <main className="flex flex-col">
      {/* Gallery page content */}
      <div className="flex flex-1 justify-center items-start py-10">
        <div className="w-full max-w-4xl border-4 border-black bg-gray-100 text-black p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-4">Gallery</h2>
          {/* <p>This is where your generated comics will appear.</p> */}

          {isLoading ? (
            <div className="pt-12 pb-12">
              <Loader />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {comicsList.map((item, index) => (
                <div
                  key={index}
                  className="w-full p-4 flex flex-col items-center justify-center space-y-2"
                >
                  <div
                    onClick={() => {
                      window.open(item.comic_url, "_blank");
                    }}
                    className="w-full relative hover:cursor-pointer"
                    style={{ aspectRatio: "1024 / 1792" }}
                  >
                    <img
                      src={item.preview_image_url}
                      alt={`Preview of ${item.recipe_name}`}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-center text-black mb-0">
                    {item.recipe_name}
                  </h3>

                  <p className="text-sm text-gray-500 text-center">
                    Generated: {formatDate(item.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
