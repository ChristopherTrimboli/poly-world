import { Metadata } from "next";
import Overlay from "./Overlay";
import Scene from "./Scene";

export const metadata: Metadata = {
  title: "poly-world",
  description: "A simple world to have fun in.",
  openGraph: {
    title: "poly-world",
    description: "A simple world to have fun in.",
    url: "https://poly-world.vercel.app/",
    locale: "en_US",
    type: "website",
  },
};

export default function PolyWorld() {
  return (
    <>
      <Overlay />
      <Scene />
    </>
  );
}
