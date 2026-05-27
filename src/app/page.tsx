import { HeroScene } from "@/features/hero";

export default function Home() {
  return (
    <main aria-label="Camera landing">
      <HeroScene
        src="/media/videos/hero-arrival-optimized.mp4"
        reverseSrc="/media/videos/hero-arrival-reverse-optimized.mp4"
      />
    </main>
  );
}
