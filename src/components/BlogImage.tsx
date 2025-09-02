import React, { useState, useEffect } from "react";

interface BlogImageProps {
  src: string;
  alt: string;
  caption: string;
  className?: string;
}

const BlogImage: React.FC<BlogImageProps> = ({
  src,
  alt,
  caption,
  className,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [fade, setFade] = useState(false);
  const ANIMATION_DURATION = 200;

  // Open modal: mount, then fade in
  const openModal = () => {
    setShowModal(true);
    setTimeout(() => setFade(true), 10); // allow mount, then fade in
  };

  // Close modal: fade out, then unmount
  const closeModal = () => {
    setFade(false);
    setTimeout(() => setShowModal(false), ANIMATION_DURATION);
  };

  return (
    <>
      <figure className="flex flex-col items-center">
        <img
          src={src}
          alt={alt}
          className={
            className + " cursor-pointer transition-opacity hover:opacity-80"
          }
          onClick={openModal}
          style={{ maxWidth: "100%" }}
        />
        <figcaption className="text-zinc-400 text-xs text-center mb-2 font-mono w-full">
          {caption}
        </figcaption>
      </figure>
      {showModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-200 ${
            fade ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeModal}>
          <div
            className="relative bg-zinc-900 rounded shadow-lg p-6 max-w-5xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}>
            <img
              src={src}
              alt={alt}
              className="max-h-[70vh] w-auto mb-4 rounded"
            />
            <figcaption className="text-zinc-300 text-sm text-center font-mono w-full">
              {caption}
            </figcaption>
            <button
              className="absolute top-0 right-2 text-zinc-400 hover:text-zinc-100 text-2xl font-bold"
              onClick={closeModal}
              aria-label="Close">
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogImage;
