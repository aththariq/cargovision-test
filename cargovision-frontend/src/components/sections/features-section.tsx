import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function FeaturesSection() {
  const features = [
    {
      title: "Sees What X-ray Sees",
      description: "Cargovision memahami isi kontainer dari citra X-ray, mendeteksi anomali, benda mencurigakan, atau kerusakan struktural dengan presisi tinggi.",
      img: "/features/xray.png",
    },
    {
      title: "Generates Reports Instantly", 
      description: "Dari hasil deteksi AI, sistem langsung membuat ringkasan dan laporan lengkap dalam bentuk PDF, siap dikirim ke regulator atau tim internal.",
      img: "/features/reports.png",
    },
    {
      title: "Understands Regulations",
      description: "Chatbot cerdas memahami konteks hukum dan kebijakan, menjawab pertanyaan tentang pelanggaran, rekomendasi, atau klasifikasi risiko.",
      img: "/features/regulations.png",
    },
    {
      title: "Notifies You in Real-Time",
      description: "Notifikasi otomatis dikirim ke petugas melalui Telegram atau dashboard ketika kontainer berisiko terdeteksi, tanpa perlu refresh.",
      img: "/features/notifies.png",
    },
    {
      title: "Learns Over Time",
      description: "Model AI Cargovision terus ditingkatkan dari data historis, semakin akurat seiring waktu, mengenali pola & prediksi risiko lebih cepat.",
      img: "/features/learns.png",
    },
    {
      title: "Works Seamlessly with Your Scanner",
      description: "Cargovision terhubung langsung ke perangkat X-ray via API, mendukung format gambar atau DICOM, tanpa perlu instalasi khusus.",
      img: "/features/seamless.png",
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-visible">
      {/* Extended border lines */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-7xl">
        <div className="absolute left-0 top-0 w-px h-[200vh] bg-gray-200 -translate-y-[12vh]"></div>
        <div className="absolute right-0 top-0 w-px h-[200vh] bg-gray-200 -translate-y-[12vh]"></div>
      </div>
      {/* Center line starting from below header */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-7xl">
        <div className="absolute left-1/2 transform -translate-x-1/2 top-[250px] w-px h-[155vh] bg-gray-200"></div>
      </div>
      
      <div className="container mx-auto px-6">
        {/* Title Section as Table Header */}
        <div className="max-w-7xl mx-auto border-l border-r border-gray-200">
          <div className="text-center py-8 px-16 border-b border-gray-200">
            <Badge variant="secondary" className="mb-4">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="block">Everything you need for</span>
              <span className="block text-blue-600">smart container inspection</span>
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {features.map((feature, index) => (
              <div key={index} className="text-left px-16 py-8 border-r border-gray-200 md:even:border-r-0 [&:nth-child(n+5)]:border-b-0 [&:nth-child(-n+4)]:border-b">
                {/* Feature Image */}
                <div className="w-full h-48 relative rounded-lg mb-6 overflow-hidden">
                  <Image src={feature.img} alt={feature.title} fill className="object-cover" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 