"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Zap, Play } from "lucide-react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

export default function HeroSection() {
  // Ref for the dynamic word span
  const wordRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  // Initialise GSAP typewriter effect
  useEffect(() => {
    if (!wordRef.current || !cursorRef.current) return;

    gsap.registerPlugin(TextPlugin);

    // Words to cycle through in the typewriter effect
    const words = ["accurate", "secure", "instant", "compliant", "reliable"];

    // Cursor blinking animation
    gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Start with empty text
    gsap.set(wordRef.current, { text: "" });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    words.forEach((word) => {
      // Type the word letter-by-letter
      tl.to(wordRef.current, {
        duration: word.length * 0.1,
        text: word,
        ease: "none",
      });

      // Hold the full word for readability
      tl.to({}, { duration: 1.5 });

      // Delete the word letter-by-letter from right to left (backspace effect)
      for (let i = word.length; i >= 0; i--) {
        tl.to(wordRef.current, {
          duration: 0.06,
          text: word.substring(0, i),
          ease: "none",
        });
      }

      // Small pause when empty before next word
      tl.to({}, { duration: 0.5 });
    });

    return () => {
      tl.kill();
    };
  }, []);



  // Easily adjust horizontal gap for hero container
  const SIDE_GAP = "1rem"; // tweak this value to increase/decrease side spacing

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden mt-5 rounded-3xl border border-white/20 px-6 md:px-10"
      style={{ width: `calc(100% - ${SIDE_GAP} * 2)`, marginInline: "auto" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg_hero.png"
          alt="Cargovision Hero Background"
          fill
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-blue-900/40 backdrop-brightness-45" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Top Badge */}
          <div className="flex justify-center">
            <div className="flex items-center bg-gray-900/90 backdrop-blur-sm text-white border border-gray-700/50 rounded-full px-[8px] py-2 text-sm">
              <span className="bg-white text-black px-2 py-1 rounded-full text-xs font-medium mr-2">
                New 🔍
              </span>
              <span className="text-gray-300">
                Accelerate container checks with smart detection
              </span>
              <span className="ml-2 text-gray-400">
                →
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <div>AI-powered cargo</div>
              <div className="flex items-center justify-center flex-wrap">
                inspection that&apos;s {" "}
                <span className="inline-flex items-center ml-2 min-w-[200px] md:min-w-[300px] lg:min-w-[400px]">
                  <span
                    ref={wordRef}
                    className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent"
                  >
                    
                  </span>
                  <span
                    ref={cursorRef}
                    className="text-white font-bold text-5xl md:text-6xl lg:text-7xl inline-block"
                    style={{ opacity: 1 }}
                  >
                    |
                  </span>
                </span>
              </div>
            </h1>
            {/* Subtitle */}
            <div className="flex justify-center">
              <p className=" max-w-3xl text-white/80 text-lg md:text-xl leading-relaxed font-normal text-center">
                Automate your container inspections with real-time X-ray analysis and instant compliance reporting.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mb-16">
            <div className="flex items-center gap-4">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 font-semibold rounded-lg px-8 py-4 text-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 h-12">
                <Play className="w-5 h-5" />
                Get a Demo
              </Button>
              <Button className="bg-gray-900/80 hover:bg-gray-900 text-white border border-gray-700 rounded-lg px-8 py-4 text-lg backdrop-blur-sm transition-all duration-200 hover:bg-gray-800 h-12">
                <Zap className="w-5 h-5" />
                See How It Works
              </Button>
            </div>
          </div>

          {/* Video moved to VideoDemoSection */}
        </div>
      </div>
    </section>
  );
} 