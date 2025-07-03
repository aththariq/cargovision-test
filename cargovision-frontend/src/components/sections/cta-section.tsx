import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  Zap, 
  Users,
  Phone,
  Calendar,
  PlayCircle
} from "lucide-react";

export default function CTASection() {
  const benefits = [
    "Free 30-day trial",
    "No setup fees",
    "24/7 support included",
    "Cancel anytime"
  ];

  const ctaOptions = [
    {
      icon: PlayCircle,
      title: "Start Free Trial",
      description: "Get full access to all features for 30 days",
      buttonText: "Start Now",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      icon: Calendar,
      title: "Schedule Demo",
      description: "See how Cargovision works for your business",
      buttonText: "Book Demo",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      icon: Phone,
      title: "Talk to Sales",
      description: "Get custom pricing for enterprise needs",
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6">
        {/* Main CTA */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
            Get Started Today
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Ready to transform your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              container inspections?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join thousands of companies already using Cargovision to streamline operations, 
            enhance security, and reduce costs. Start your journey today.
          </p>
          
          {/* Benefits List */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {ctaOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Card 
                key={index} 
                className={`relative group hover:shadow-xl transition-all duration-300 border-0 shadow-sm ${
                  option.popular ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
              >
                {option.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${option.popular ? 'bg-blue-600' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${option.popular ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {option.description}
                  </p>
                  <Button 
                    variant={option.buttonVariant}
                    className={`w-full ${option.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  >
                    {option.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="font-medium">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="font-medium">500+ Companies</span>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="max-w-2xl mx-auto text-center mt-16 p-6 bg-white rounded-2xl shadow-sm border">
          <p className="text-gray-600 mb-4">
            <strong className="text-gray-900">Still have questions?</strong> Our team is here to help you find the perfect solution for your container inspection needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
              View Documentation
            </Button>
            <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 