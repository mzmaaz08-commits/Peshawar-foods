import React, { useRef, useState } from 'react'

export default function Card3DEffect({ children, className = '' }) {
  const cardRef = useRef(null)
  const [rotX, setRotX] = useState(0)
  const [rotY, setRotY] = useState(0)
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -10
    const rotateY = ((x - centerX) / centerX) * 10

    setRotX(rotateX)
    setRotY(rotateY)

    const glowX = (x / rect.width) * 100
    const glowY = (y / rect.height) * 100
    setGlowPos({ x: glowX, y: glowY })
  }

  const handleMouseLeave = () => {
    setRotX(0)
    setRotY(0)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        transition: rotX === 0 && rotY === 0 ? 'transform 0.5s ease' : 'none',
      }}
      className={`relative group overflow-hidden transition-shadow duration-300 ${className}`}
    >
      {/* Dynamic 3D Radial Cursor Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-3xl"
        style={{
          background: `radial-gradient(600px circle at ${glowPos.x}% ${glowPos.y}%, rgba(245, 158, 11, 0.15), transparent 40%)`,
        }}
      />
      {children}
    </div>
  )
}
