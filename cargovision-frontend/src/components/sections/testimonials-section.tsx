import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Logistics Director",
      company: "Global Shipping Co.",
      avatar: "SJ",
      rating: 5,
      content: "Cargovision has revolutionized our container inspection process. We've reduced inspection time by 70% while improving accuracy. The AI-powered detection system catches issues we would have missed manually.",
      stats: "70% faster inspections"
    },
    {
      name: "Michael Chen",
      role: "Port Operations Manager",
      company: "Pacific Port Authority",
      avatar: "MC",
      rating: 5,
      content: "The real-time monitoring capabilities are outstanding. We can track multiple containers simultaneously and receive instant alerts for any anomalies. It's like having eyes everywhere.",
      stats: "500+ containers monitored daily"
    },
    {
      name: "Emma Rodriguez",
      role: "Quality Assurance Lead",
      company: "Cargo Secure Ltd.",
      avatar: "ER",
      rating: 5,
      content: "Implementation was seamless, and the support team is exceptional. The dashboard provides insights we never had before, helping us maintain the highest security standards.",
      stats: "99.9% accuracy rate"
    },
    {
      name: "David Kim",
      role: "Supply Chain Director",
      company: "International Freight",
      avatar: "DK",
      rating: 5,
      content: "Cost savings have been significant. The automated reporting and compliance features alone have saved us countless hours. ROI was achieved within the first quarter.",
      stats: "40% cost reduction"
    },
    {
      name: "Lisa Thompson",
      role: "Security Manager",
      company: "Secure Logistics",
      avatar: "LT",
      rating: 5,
      content: "The mobile interface is incredibly user-friendly. Our field teams can perform inspections and access data from anywhere. The offline capabilities are a game-changer.",
      stats: "24/7 accessibility"
    },
    {
      name: "Robert Wilson",
      role: "Operations Director",
      company: "Metro Container Services",
      avatar: "RW",
      rating: 5,
      content: "Integration with our existing systems was flawless. The API documentation is comprehensive, and the development team provided excellent support throughout the process.",
      stats: "Seamless integration"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Testimonials
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trusted by industry leaders{" "}
            <span className="text-blue-600">worldwide</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of companies who trust Cargovision to secure and streamline 
            their container inspection operations.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-sm">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="flex justify-between items-start mb-4">
                  <Quote className="w-8 h-8 text-blue-500 opacity-50" />
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Stats Badge */}
                <div className="mb-6">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    {testimonial.stats}
                  </Badge>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <Image
                    src={`https://i.pravatar.cc/80?u=${encodeURIComponent(testimonial.name)}`}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}
                    </p>
                    <p className="text-sm text-blue-600 font-medium">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 