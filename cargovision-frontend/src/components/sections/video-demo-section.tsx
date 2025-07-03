"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function VideoDemoSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { 
          scale: 0.9,
          transformOrigin: "top center"
        },
        {
          scale: 1.2,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "center center",
            scrub: 2,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative z-30 -mt-32 mb-32 pointer-events-none">
      <div
        ref={containerRef}
        className="max-w-6xl mx-auto aspect-video rounded-lg overflow-hidden shadow-2xl transform-gpu"
      >
        <video
          src="https://cdn.cargovision.app/video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
} 