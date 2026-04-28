'use client'
import { useRef, useEffect, useState } from 'react'
import { useFaceMesh } from '@/hooks/useFaceMesh'

const FRAMES = [
  { id: 'aviator', name: 'Aviator', src: '/frames/aviator.svg' },
  { id: 'wayfarer', name: 'Wayfarer', src: '/frames/wayfarer.svg' },
  { id: 'round', name: 'Round', src: '/frames/round.svg' },
  { id: 'cateye', name: 'Cat Eye', src: '/frames/cateye.svg' },
  { id: 'rectangular', name: 'Rectangular', src: '/frames/rectangular.svg' },
]

export default function VirtualTryOn() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [activeFrame, setActiveFrame] = useState(FRAMES[0])
  const [tint, setTint] = useState('clear')
  const landmarks = useFaceMesh(videoRef)

  // Preload all frame images once
  const frameImagesRef = useRef({})
  useEffect(() => {
    FRAMES.forEach(f => {
      const img = new Image()
      img.src = f.src
      frameImagesRef.current[f.id] = img
    })
  }, [])

  // Draw every time landmarks update
  useEffect(() => {
    if (!landmarks || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height

    // Clear previous frame
    ctx.clearRect(0, 0, W, H)

    // Draw mirrored video feed
    if (videoRef.current && videoRef.current.readyState >= 2) {
      ctx.save()
      ctx.scale(-1, 1)
      ctx.drawImage(videoRef.current, -W, 0, W, H)
      ctx.restore()
    }

    // Get the 3 key points
    const noseBridge = landmarks[168]
    const leftTemple = landmarks[234]
    const rightTemple = landmarks[454]

    // Mirror the X coordinates for landmarks too since we mirror the video
    const noseX = (1 - noseBridge.x) * W
    const noseY = noseBridge.y * H
    const faceWidth = Math.abs(rightTemple.x - leftTemple.x) * W

    // Frame is 400px wide in SVG — scale to face width with padding
    const scale = (faceWidth * 1.35) / 400
    const frameW = 400 * scale
    const frameH = 150 * scale

    // Position: center horizontally on nose, slight vertical offset up
    const drawX = noseX - frameW / 2
    const drawY = noseY - frameH * 0.55

    ctx.save()
    // Apply tint filter
    if (tint === 'amber') ctx.filter = 'sepia(50%) hue-rotate(-10deg) brightness(0.95)'
    if (tint === 'night') ctx.filter = 'hue-rotate(90deg) brightness(1.2) saturate(180%)'

    // Draw the SVG frame image onto canvas
    const img = frameImagesRef.current[activeFrame.id]
    if (img && img.complete) {
      ctx.drawImage(img, drawX, drawY, frameW, frameH)
    }
    ctx.restore()

  }, [landmarks, activeFrame, tint])

  function saveScreenshot() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'my-EYELOVEYOU-look.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto bg-[#0A0E1A] p-4">
      {/* Video (hidden, used as source) */}
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        muted
      />

      {/* Canvas (shows webcam + frame overlay) */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Loading Indicator */}
        {!landmarks && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy/80 backdrop-blur-sm z-50">
            <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin mb-4" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Synchronizing Biometrics...</p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-full object-cover rounded-none border border-[#C9A84C]/20"
        />

        {/* Save button overlay */}
        {landmarks && (
          <button
            onClick={saveScreenshot}
            className="absolute bottom-4 right-4 bg-[#C9A84C] text-[#0A0E1A] px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-colors z-40"
          >
            Capture Look
          </button>
        )}
      </div>

      {/* Frame selector */}
      <div className="grid grid-cols-5 gap-2 mt-4">
        {FRAMES.map(frame => (
          <button
            key={frame.id}
            onClick={() => setActiveFrame(frame)}
            className={`
              py-3 px-2 border text-[10px] tracking-widest uppercase transition-all
              ${activeFrame.id === frame.id
                ? 'border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/5'
                : 'border-white/10 text-white/40 hover:border-[#C9A84C]/40'}
            `}
          >
            {frame.name}
          </button>
        ))}
      </div>

      {/* Tint selector */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {['clear', 'amber', 'night'].map(t => (
          <button
            key={t}
            onClick={() => setTint(t)}
            className={`
              py-2 text-[10px] tracking-widest uppercase border transition-all
              ${tint === t
                ? 'border-[#C9A84C] text-[#C9A84C]'
                : 'border-white/10 text-white/30'}
            `}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}
