
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
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Studio Gallery
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Take a look inside 3rd Street Music's professional recording facility. From our state-of-the-art control room to our acoustically treated live spaces, every corner is designed for creating exceptional music.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group cursor-pointer overflow-hidden rounded-lg bg-gray-900 hover:bg-gray-800 transition-all duration-300"
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{image.title}</h3>
                  <p className="text-gray-400 text-sm">{image.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-6xl max-h-full" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
              onClick={closeLightbox}
            >
              <X size={24} />
            </Button>

            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 hover:bg-black/70"
              onClick={prevImage}
            >
              <ChevronLeft size={24} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 hover:bg-black/70"
              onClick={nextImage}
            >
              <ChevronRight size={24} />
            </Button>

            {/* Image */}
            <img
              src={galleryImages[selectedImage].src}
              alt={galleryImages[selectedImage].alt}
              className="max-w-full max-h-[80vh] object-contain"
            />

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {galleryImages[selectedImage].title}
              </h3>
              <p className="text-gray-300">
                {galleryImages[selectedImage].description}
              </p>
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded">
              {selectedImage + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Record?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience our world-class facilities firsthand. Book your session today and create something amazing.
          </p>
          <Button
            onClick={() => window.location.href = '/lessons'}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Book Studio Time
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
