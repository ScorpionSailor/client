import React, { useCallback, useMemo, useRef } from 'react';

const ProductImageCarousel = ({
  images = [],
  activeIndex = 0,
  onActiveIndexChange = () => {}
}) => {
  const touchStartX = useRef(null);
  const isSwipeDisabled = images.length <= 1;

  const handlePrev = useCallback(() => {
    if (!images.length) return;
    const nextIndex = (activeIndex - 1 + images.length) % images.length;
    onActiveIndexChange(nextIndex);
  }, [activeIndex, images.length, onActiveIndexChange]);

  const handleNext = useCallback(() => {
    if (!images.length) return;
    const nextIndex = (activeIndex + 1) % images.length;
    onActiveIndexChange(nextIndex);
  }, [activeIndex, images.length, onActiveIndexChange]);

  const handleTouchStart = useCallback((event) => {
    if (isSwipeDisabled) return;
    touchStartX.current = event.touches[0].clientX;
  }, [isSwipeDisabled]);

  const handleTouchMove = useCallback((event) => {
    if (isSwipeDisabled || touchStartX.current === null) return;
    const deltaX = event.touches[0].clientX - touchStartX.current;

    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        handlePrev();
      } else {
        handleNext();
      }

      touchStartX.current = null;
    }
  }, [handleNext, handlePrev, isSwipeDisabled]);

  const handleTouchEnd = useCallback(() => {
    touchStartX.current = null;
  }, []);

  const slides = useMemo(() => {
    if (!Array.isArray(images)) return [];
    return images
      .filter((image) => image && image.url)
      .map((image, index) => ({
        url: image.url,
        alt: image.alt || `Product image ${index + 1}`
      }));
  }, [images]);

  const clampedIndex = slides.length ? Math.max(0, Math.min(activeIndex, slides.length - 1)) : 0;
  const hasMultiple = slides.length > 1;

  return (
    <div className="product-carousel">
      <div
        className="carousel-main"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${clampedIndex * 100}%)`
          }}
        >
          {slides.length ? (
            slides.map((image, index) => (
              <div className="carousel-slide" key={`${image.url}-${index}`}>
                <img src={image.url} alt={image.alt} />
              </div>
            ))
          ) : (
            <div className="carousel-slide empty">
              <div className="carousel-placeholder">
                <span>No image available</span>
              </div>
            </div>
          )}
        </div>

        {hasMultiple && (
          <>
            <button
              type="button"
              className="carousel-nav prev"
              aria-label="Show previous image"
              onClick={handlePrev}
            >
              ‹
            </button>
            <button
              type="button"
              className="carousel-nav next"
              aria-label="Show next image"
              onClick={handleNext}
            >
              ›
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="carousel-thumbnails">
          {slides.map((image, index) => (
            <button
              key={`${image.url}-${index}-thumb`}
              type="button"
              className={`thumbnail-button ${index === clampedIndex ? 'active' : ''}`}
              onClick={() => onActiveIndexChange(index)}
              aria-label={`Show image ${index + 1}`}
            >
              <img src={image.url} alt={image.alt} />
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .product-carousel {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .carousel-main {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
        }

        .carousel-track {
          display: flex;
          width: 100%;
          transition: transform 0.4s ease;
        }

        .carousel-slide {
          min-width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-gray-100);
        }

        .carousel-slide img {
          width: 100%;
          height: 600px;
          object-fit: cover;
        }

        .carousel-slide.empty {
          background-color: var(--color-gray-200);
          height: 600px;
        }

        .carousel-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--color-gray-500);
          font-weight: 600;
        }

        .carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background-color: rgba(0, 0, 0, 0.6);
          color: var(--color-white);
          font-size: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s ease;
          z-index: 2;
        }

        .carousel-nav:hover {
          background-color: rgba(0, 0, 0, 0.75);
          transform: translateY(-50%) scale(1.05);
        }

        .carousel-nav.prev {
          left: 16px;
        }

        .carousel-nav.next {
          right: 16px;
        }

        .carousel-thumbnails {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .thumbnail-button {
          border: 2px solid transparent;
          padding: 0;
          border-radius: 10px;
          overflow: hidden;
          width: 80px;
          height: 80px;
          cursor: pointer;
          transition: border-color 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
          opacity: 0.65;
        }

        .thumbnail-button img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .thumbnail-button:hover {
          opacity: 1;
          transform: scale(1.03);
        }

        .thumbnail-button.active {
          border-color: var(--color-neon-green);
          opacity: 1;
        }

        @media (max-width: 968px) {
          .carousel-slide img,
          .carousel-slide.empty {
            height: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductImageCarousel;


