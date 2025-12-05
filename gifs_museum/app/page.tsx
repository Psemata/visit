import Scene from "@/components/scene/Scene";
import { fetchGifsByTag } from "@/actions/gifs/fetchGifsByTag";

export default async function Home() {
  const gifs = await fetchGifsByTag();

  return <Scene gifs={gifs} />;
}
