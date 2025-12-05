"use client";

import { Canvas } from "@react-three/fiber";
import { KeyboardControls, PointerLockControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Ground from "../elements/room/Ground";
import Visitor from "../visitor/Visitor";
import type GIF from "@/type/GIF";
import Room from "../elements/room/Room";
import GifWall from "../elements/displays/GifWall";
import { useState, useRef, useCallback } from "react";
import StarryCeiling from "../elements/room/StarryCeiling";

interface SceneProps {
  gifs: Array<GIF>;
}

const Scene = ({ gifs }: SceneProps) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState<string>("");
  const [currentTitle, setCurrentTitle] = useState<string>("");

  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentGifRef = useRef<string>("");

  const onEnter = useCallback((authorName: string, title: string) => {
    const gifId = `${authorName}-${title}`;

    if (currentGifRef.current === gifId) {
      return;
    }

    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }

    console.log("Visitor entered the GIF wall area.");
    currentGifRef.current = gifId;
    setCurrentAuthor(authorName);
    setCurrentTitle(title);
    setIsOverlayVisible(true);
  }, []);

  const onExit = useCallback(() => {
    console.log("Visitor exited the GIF wall area.");

    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
    }

    exitTimeoutRef.current = setTimeout(() => {
      currentGifRef.current = "";
      setIsOverlayVisible(false);
      setTimeout(() => {
        setCurrentAuthor("");
        setCurrentTitle("");
      }, 300);
    }, 150);
  }, []);

  const gifsByAuthor: { [authorId: number]: GIF[] } = {};

  gifs.forEach((gif) => {
    if (!gifsByAuthor[gif.author.id]) {
      gifsByAuthor[gif.author.id] = [];
    }
    gifsByAuthor[gif.author.id].push(gif);
  });

  return (
    <div className="relative w-full h-screen image-rendering-pixelated">
      {/* Overlay UI (hidden by default) */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center pb-16 transition-opacity duration-300 z-10 ${
          isOverlayVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {currentAuthor && currentTitle && (
          <div
            className="flex flex-col pointer-events-auto font-sans text-[#FDEB37] text-4xl font-medium tracking-wide px-4 py-1"
            style={{
              textShadow:
                "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 0 8px rgba(0,0,0,0.8)",
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            {currentAuthor} - {currentTitle}
          </div>
        )}
      </div>

      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <Canvas
          shadows
          camera={{ fov: 45, rotation: [0, Math.PI, 0] }}
          frameloop="always"
        >
          <ambientLight intensity={0.035} color="#ffffff" />
          <Physics gravity={[0, -9.81, 0]}>
            <Room />
            <StarryCeiling />
            <Ground />
            {/* Visitor / User - Default position is [0, 1, 0] */}
            <Visitor />
            {/* GIFS */}
            {Object.entries(gifsByAuthor).map(
              ([authorId, authorGifs], index) => {
                const position: [number, number, number] = [
                  index % 2 === 0 ? -10 : 10,
                  2.5,
                  -40 + index * 9,
                ];

                return (
                  <GifWall
                    key={authorId}
                    gifs={authorGifs}
                    position={position}
                    rotation={[0, 0, 0]}
                    onEnter={onEnter}
                    onExit={onExit}
                  />
                );
              }
            )}
          </Physics>
          <PointerLockControls />
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default Scene;
