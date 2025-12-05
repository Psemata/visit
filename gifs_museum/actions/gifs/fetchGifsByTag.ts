"use server";

import type GIF from "@/type/GIF";

export const fetchGifsByTag = async (
  tag = "head-25-exhibition"
): Promise<GIF[]> => {
  try {
    const url = `https://128kb.eu/wp-json/custom/v1/gifs?tag=${encodeURIComponent(
      tag
    )}`;
    const requestOptions: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      console.log("[v0] Fetch failed with status:", response.status);
      throw Error("An error occurred while fetching the gifs from the API.");
    }
    const gifsList = await response.json();
    const transformedGifs: GIF[] = gifsList.map((gif: GIF) => ({
      id: gif.id,
      title: gif.title,
      permalink: gif.permalink,
      thumbnail_url: `/api/proxy-image?url=${encodeURIComponent(
        gif.thumbnail_url
      )}`,
      linkto: gif.linkto,
      creator: gif.creator,
      pixel_dimensions: gif.pixel_dimensions,
      frames: gif.frames,
      date_created: gif.date_created,
      colors: gif.colors,
      file_size_kb: gif.file_size_kb,
      additional_notes: gif.additional_notes,
      tags: gif.tags,
      author: {
        id: gif.author.id,
        name: gif.author.name,
        url: gif.author.url,
        avatar: `/api/proxy-image?url=${encodeURIComponent(gif.author.avatar)}`,
      },
    }));
    return transformedGifs;
  } catch (error) {
    console.error("[v0] Error in fetchGifsByTag:", error);
    return [];
  }
};
