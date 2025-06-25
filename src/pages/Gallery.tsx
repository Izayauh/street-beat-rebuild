
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryImages = [
    {
      src: '/lovable-uploads/ec3624b8-81f1-4a7b-9d55-663f9f753905.png',
      alt: 'Professional mixing console and studio monitors in our main control room',
      title: 'Main Control Room',
      description: 'State-of-the-art mixing console with professional studio monitors and DAW setup'
    },
    {
      src: '/lovable-uploads/768155eb-846a-4160-8999-a5b0544d7e7f.png',
      alt: 'Group of musicians and producers collaborating in the studio',
      title: 'Creative Collaboration',
      description: 'Our talented team of musicians and producers working together'
    },
    {
      src: '/lovable-uploads/6757dfd0-698f-4529-8b80-7e88431d311e.png',
      alt: 'Guitar recording session with acoustic treatment and professional setup',
      title: 'Guitar Recording Session',
      description: 'Professional guitar recording with acoustic treatment and premium microphones'
    },
    {
      src: '/lovable-uploads/f47871fa-f62f-4059-81a8-65fe52474e02.png',
      alt: 'Drum kit setup in acoustically treated live room',
      title: 'Live Room - Drum Setup',
      description: 'Premium drum kit in our acoustically treated live recording space'
    },
    {
      src: '/lovable-uploads/d58e2fea-58ed-4e9f-aab6-9a2b4d9f80b8.png',
      alt: 'Vintage keyboards and Hammond organ setup',
      title: 'Vintage Keyboard Collection',
      description: 'Collection of vintage keyboards including Hammond organ and classic synths'
    }
  ];

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section with analog warmth */}
      <section className="pt-24 pb-16 px-4 section-warm relative">
        <div className="absolute inset-0 texture-grain opacity-20"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 analog-gradient bg-clip-text text-transparent warm-text-glow">
            Studio Gallery
          </h1>
          <p className="text-xl text-amber-200/80 max-w-3xl mx-auto text-serif leading-relaxed">
            Step inside 3rd Street Music's creative sanctuary. From our vintage-modern control room to our acoustically crafted live spaces, every corner breathes music and inspiration.
          </p>
        </div>
      </section>

      {/* Gallery Grid with enhanced styling */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group cursor-pointer overflow-hidden rounded-xl card-analog hover:warm-glow transition-all duration-500 transform hover:-translate-y-2"
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-amber-400 mb-3 group-hover:warm-text-glow transition-all duration-300">
                    {image.title}
                  </h3>
                  <p className="text-amber-200/70 text-sm text-serif leading-relaxed">
                    {image.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal with analog styling */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 texture-grain"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-6xl max-h-full" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-amber-400 hover:text-amber-300 z-10 glass-effect hover:warm-glow"
              onClick={closeLightbox}
            >
              <X size={24} />
            </Button>

            {/* Navigation Buttons with analog styling */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-300 glass-effect hover:warm-glow transition-all duration-300"
              onClick={prevImage}
            >
              <ChevronLeft size={28} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-300 glass-effect hover:warm-glow transition-all duration-300"
              onClick={nextImage}
            >
              <ChevronRight size={28} />
            </Button>

            {/* Image with warm border */}
            <div className="rounded-lg overflow-hidden warm-glow">
              <img
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>

            {/* Image Info with analog styling */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-8">
              <h3 className="text-3xl font-bold text-amber-400 mb-3 warm-text-glow">
                {galleryImages[selectedImage].title}
              </h3>
              <p className="text-amber-200/80 text-lg text-serif leading-relaxed">
                {galleryImages[selectedImage].description}
              </p>
            </div>

            {/* Image Counter with warm styling */}
            <div className="absolute top-4 left-4 glass-effect text-amber-400 px-4 py-2 rounded-lg font-medium">
              {selectedImage + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}

      {/* Call to Action with enhanced analog styling */}
      <section className="py-20 px-4 analog-gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 texture-grain opacity-30"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-amber-400 warm-text-glow">
            Ready to Record?
          </h2>
          <p className="text-xl text-amber-200/80 mb-10 max-w-2xl mx-auto text-serif leading-relaxed">
            Experience our world-class facilities firsthand. Book your session today and let's create something extraordinary together.
          </p>
          <Button
            onClick={() => window.location.href = '/lessons'}
            className="btn-analog text-black px-10 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
          >
            Book Studio Time
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
