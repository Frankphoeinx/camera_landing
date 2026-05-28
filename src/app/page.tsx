import { HeroScene } from "@/features/hero";

export default function Home() {
  return (
    <main aria-label="Camera landing">
      <HeroScene
        src="/media/videos/hero-arrival-optimized.mp4"
        reverseSrc="/media/videos/hero-arrival-reverse-optimized.mp4"
        reverseToCapabilitySrc="/media/videos/hero-arrival-reverse-10-to-4-optimized.mp4"
        reverseToOperationsSrc="/media/videos/hero-arrival-reverse-final-to-10-optimized.mp4"
      />
    </main>
  );
}
