import { HeroScene } from "@/features/hero";
import { InstallationSection, TechnicalScrollScene } from "@/features/landing";

export default function Home() {
  return (
    <main aria-label="Camera landing">
      <HeroScene
        src="/media/videos/hero-arrival.7fdafa75.mp4"
        srcWebm="/media/videos/hero-arrival.774f4cc9.webm"
        reverseSrc="/media/videos/hero-arrival-reverse.430d00d5.mp4"
        reverseSrcWebm="/media/videos/hero-arrival-reverse.c2fc64f1.webm"
        reverseToCapabilitySrc="/media/videos/hero-arrival-reverse-10-to-4.742b1757.mp4"
        reverseToCapabilitySrcWebm="/media/videos/hero-arrival-reverse-10-to-4.9313c13e.webm"
        reverseToOperationsSrc="/media/videos/hero-arrival-reverse-final-to-10.3b1879c2.mp4"
        reverseToOperationsSrcWebm="/media/videos/hero-arrival-reverse-final-to-10.35fadbe2.webm"
        poster="/media/images/hero-arrival-poster.86331ef3.webp"
      />
      <InstallationSection />
      <TechnicalScrollScene
        mp4Src="/media/videos/camera-technical.ff528cc4.mp4"
        reverseMp4Src="/media/videos/camera-technical-reverse.9c204762.mp4"
        reverseWebmSrc="/media/videos/camera-technical-reverse.1c12908a.webm"
        webmSrc="/media/videos/camera-technical.46fb894a.webm"
        poster="/media/images/camera-technical-poster.2dc1c5f8.webp"
      />
    </main>
  );
}
