"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo } from "react";

interface ScrollWheelProps {
  items: Array<{ src: string; alt: string; href?: string }>;
}

export function ScrollWheel({ items }: ScrollWheelProps) {
  const marqueeItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    // Duplicate array so the animation can loop seamlessly.
    return [...items, ...items];
  }, [items]);

  return (
    <div className="overflow-hidden py-8">
      <div
        className="flex gap-8"
        style={{
          width: "max-content",
          animation: "carma-marquee 25s linear infinite",
        }}
      >
        {marqueeItems.map((item, index) => (
          <div
            key={`${item.src}-${index}`}
            className="flex-shrink-0 flex items-center justify-center h-10 opacity-60 hover:opacity-100 transition-opacity duration-300"
          >
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="h-full"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-auto object-contain filter brightness-0 invert"
                />
              </a>
            ) : (
              <img
                src={item.src}
                alt={item.alt}
                className="h-full w-auto object-contain filter brightness-0 invert"
              />
            )}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes carma-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
