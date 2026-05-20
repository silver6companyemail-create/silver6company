'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

export default function AdPopup() {
  const [ad, setAd] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Only show once per session
    const dismissed = sessionStorage.getItem('ad_dismissed')
    if (dismissed) return

    const fetchAd = async () => {
      try {
        const res = await fetch('http://localhost:1000/api/ads/active')
        if (res.ok) {
          const data = await res.json()
          if (data && data.image) {
            setAd(data)
            // Slight delay for effect
            setTimeout(() => setIsVisible(true), 800)
          }
        }
      } catch (err) {
        console.error('Failed to fetch ad:', err)
      }
    }

    fetchAd()
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    sessionStorage.setItem('ad_dismissed', 'true')
    setTimeout(() => {
      setIsVisible(false)
      setIsClosing(false)
      setAd(null)
    }, 300)
  }

  if (!ad || !isVisible) return null

  const content = (
    <div className="relative max-w-lg w-full mx-4 rounded-2xl overflow-hidden shadow-2xl">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 z-20 w-9 h-9 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Ad Image */}
      <div className="relative w-full">
        <Image
          src={ad.image}
          alt={ad.title || 'Promotion'}
          width={600}
          height={700}
          className="w-full h-auto object-cover"
          unoptimized
          priority
        />
        {/* Gradient overlay at bottom */}
        {ad.title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6">
            <p className="text-white font-bold text-lg drop-shadow">{ad.title}</p>
          </div>
        )}
      </div>

      {/* Visit Link Bar */}
      {ad.link && (
        <a
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClose}
          className="block w-full bg-[#2db34a] hover:bg-[#259b3f] text-white text-center py-3.5 font-bold text-sm transition-colors tracking-wide"
        >
          Shop Now →
        </a>
      )}
    </div>
  )

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center transition-all duration-300 ${
        isClosing
          ? 'opacity-0 scale-95'
          : 'opacity-100 scale-100'
      }`}
      style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div className={`transition-all duration-300 ${isClosing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        {content}
      </div>
    </div>
  )
}
