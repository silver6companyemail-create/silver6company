'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

function getYoutubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function ReviewCard({ review }: { review: any }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = getYoutubeId(review.youtubeLink);

  return (
    <div className="flex flex-col h-[400px] md:h-[500px] rounded-2xl overflow-hidden group bg-black hover:shadow-lg transition-shadow relative">
      {!isPlaying ? (
        <div 
          className="relative w-full h-full cursor-pointer overflow-hidden" 
          onClick={() => setIsPlaying(true)}
        >
          <Image
            src={review.thumbnail}
            alt={review.name}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 flex flex-col justify-end p-5 transition-colors group-hover:to-black/90">
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center pl-1 shadow-lg transform group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-gray-900" />
              </div>
            </div>
            
            {/* Reel text overlay */}
            <div className="relative z-20 text-white transform group-hover:-translate-y-2 transition-transform duration-300">
              <h3 className="font-bold text-lg mb-1 drop-shadow-md text-white">{review.name}</h3>
              <p className="text-sm line-clamp-3 text-gray-200 drop-shadow-md">{review.description}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-black relative">
          {videoId ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={review.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white p-4 text-center">
              <p className="text-red-400 font-medium">Invalid Video URL</p>
              <a href={review.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 mt-2 hover:underline text-sm">
                Open in new tab
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
