import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export default function JoinSection() {
  return (
    <section className="relative py-16 md:py-20" aria-label="Join Cargovision">
      <div className="container mx-auto px-6">
        <div className="relative bg-white border border-gray/20 rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row items-center max-w-6xl mx-auto">
          {/* Text column */}
          <div className="w-full md:w-7/12 p-6 md:p-12 flex flex-col gap-4">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Join 100+ companies already improving with <span className="bg-gradient-to-r text-blue-600 bg-clip-text inline">Cargovision</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-prose">
              We built the complete cargo inspection platform, so you don&apos;t have to worry.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md px-6 py-2">
                Sign up now
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2"
              >
                Contact Us
                <Phone className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Image column */}
          <div className="w-full md:w-5/12 relative min-h-[220px] md:min-h-[300px] lg:min-h-[340px]">
            <Image
              src="https://via.placeholder.com/800x600.png?text=Dashboard+Preview"
              alt="Dashboard preview placeholder"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
} 