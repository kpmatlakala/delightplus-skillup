import Header from "@/components/Home/Header";
import Footer from "@/components/Footer";

export default function AccreditationPage() {
  const partners = [
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
    { name: "Huawei", logo: "https://thedatascienceacademy.co.za/wp-content/uploads/2025/12/Huawei-Logo.wine_-scaled.png" },
    { name: "QCTO", logo: "https://thedatascienceacademy.co.za/wp-content/uploads/2025/12/Quality-Council-for-Trades-and-Occupations-QCTO-Hero-1-_1_-3.webp" },
    { name: "MICT SETA", logo: "https://thedatascienceacademy.co.za/wp-content/uploads/2025/12/images-3.jpeg" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section – matches design exactly */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://thedatascienceacademy.co.za/wp-content/uploads/2025/12/Gemini_Generated_Image_w015j4w015j4w015.png')",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(226,100%,14%,0.9)] via-[hsl(224,82%,22%,0.78)] to-[hsl(224,100%,64%,0.35)]" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Accreditation</h1>
          <p className="text-lg md:text-xl max-w-2xl text-white/90">
            Accredited certifications aligned with national &amp; international quality standards,
            backed by MICT-SETA and QCTO — empowering your tech career journey.
          </p>
        </div>
      </section>

      {/* Accreditation Logos Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
            Accreditations &amp; Partners
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            Our training is aligned with global technology leaders and South African accreditation authorities,
            ensuring internationally recognised and industry-relevant qualifications.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 items-center">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="bg-card rounded-xl p-5 shadow-sm hover:-translate-y-2 hover:shadow-md transition-all duration-300 flex items-center justify-center h-28 border border-border"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-16 w-auto object-contain opacity-80 hover:opacity-100 transition"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}