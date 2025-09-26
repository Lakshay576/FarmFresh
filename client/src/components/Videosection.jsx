import React from 'react';
import farmVideo from '/farmvedio.mp4'; // Ensure the video file is in the public directory

const Videosection = () => {
  return (
    <section className="relative mt-0.5 mb-0.5 shadow-2xl h-[100vh] w-full flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        // IMPORTANT: Place your video file (e.g., 'farm-video.mp4') in your project's `public` folder.
        // Then, update the src path here if your filename is different.
        src={farmVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
      >
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-center text-white p-4">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          Connecting Fields to Your Future
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Experience the journey of fresh produce, from the heart of the farm directly to you, powered by seamless logistics.
        </p>
      </div>
    </section>
  );
};

export default Videosection;
