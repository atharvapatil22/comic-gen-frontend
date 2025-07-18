"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

export default function GalleryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [comicsList, setComicsList] = useState([]);

  useEffect(() => {
    async function fetchComics() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("workloads")
        .select("id, recipe_name, preview_image_url");

      if (error) {
        console.error("Error fetching comics:", error);
      } else {
        setComicsList(data);
      }
      setIsLoading(false);
    }

    fetchComics();
  }, []);

  return (
    <main className="flex flex-col">
      {/* Gallery page content */}
      <div className="flex flex-1 justify-center items-start py-10">
        <div className="w-full max-w-4xl border-4 border-black bg-gray-100 text-black p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-8">Gallery</h2>
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
                  className="h-48 w-full bg-blue-300 rounded-md shadow-sm flex items-center justify-center text-white font-semibold"
                >
                  Item {index + 1}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
