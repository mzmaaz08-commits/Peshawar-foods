import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Hero3DCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const currentMount = mountRef.current
    if (!currentMount) return

    let animationFrameId
    let renderer, handleResize, handleMouseMove

    try {
      // Scene, Camera, Renderer
      const scene = new THREE.Scene()
      const width = currentMount.clientWidth || window.innerWidth
      const height = currentMount.clientHeight || 500
      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
      camera.position.z = 12

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      currentMount.appendChild(renderer.domElement)

      // Ambient & Directional Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
      scene.add(ambientLight)

      const mainLight = new THREE.DirectionalLight(0xff6b00, 2.5)
      mainLight.position.set(10, 15, 10)
      scene.add(mainLight)

      const accentLight = new THREE.PointLight(0xffd700, 3, 30)
      accentLight.position.set(-8, -5, 5)
      scene.add(accentLight)

      const blueLight = new THREE.PointLight(0xec4899, 2, 20)
      blueLight.position.set(8, 8, -5)
      scene.add(blueLight)

      // Group for 3D objects
      const mainGroup = new THREE.Group()
      scene.add(mainGroup)

      // 1. Procedural 3D Gourmet Dish Platter (Base Cylinder + Food Spheres & Rings)
      const plateGeo = new THREE.CylinderGeometry(3.5, 3.2, 0.4, 64)
      const plateMat = new THREE.MeshStandardMaterial({
        color: 0x18182b,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
      })
      const plate = new THREE.Mesh(plateGeo, plateMat)
      plate.position.set(0, -1, 0)
      mainGroup.add(plate)

      const rimGeo = new THREE.TorusGeometry(3.6, 0.15, 16, 100)
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xff6b00,
        emissive: 0xff3b00,
        emissiveIntensity: 0.6,
        metalness: 0.9,
      })
      const rim = new THREE.Mesh(rimGeo, rimMat)
      rim.rotation.x = Math.PI / 2
      rim.position.set(0, -0.8, 0)
      mainGroup.add(rim)

      // 3D Burger Bun & Patty (Stylized geometry)
      const burgerGroup = new THREE.Group()

      // Top Bun
      const topBunGeo = new THREE.SphereGeometry(1.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)
      const bunMat = new THREE.MeshStandardMaterial({ color: 0xe3964a, roughness: 0.4 })
      const topBun = new THREE.Mesh(topBunGeo, bunMat)
      topBun.position.y = 1.0
      topBun.scale.set(1, 0.7, 1)
      burgerGroup.add(topBun)

      // Sesame Seeds on top bun
      const seedGeo = new THREE.ConeGeometry(0.06, 0.15, 8)
      const seedMat = new THREE.MeshStandardMaterial({ color: 0xfffdd0 })
      for (let i = 0; i < 25; i++) {
        const seed = new THREE.Mesh(seedGeo, seedMat)
        const phi = Math.random() * Math.PI * 2
        const theta = Math.random() * (Math.PI / 3)
        seed.position.set(
          1.2 * Math.sin(theta) * Math.cos(phi),
          0.8 + 0.4 * Math.cos(theta),
          1.2 * Math.sin(theta) * Math.sin(phi)
        )
        seed.rotation.x = Math.random() * Math.PI
        burgerGroup.add(seed)
      }

      // Cheese Slice
      const cheeseGeo = new THREE.BoxGeometry(2.2, 0.08, 2.2)
      const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xffc107, roughness: 0.3 })
      const cheese = new THREE.Mesh(cheeseGeo, cheeseMat)
      cheese.position.y = 0.55
      cheese.rotation.y = Math.PI / 6
      burgerGroup.add(cheese)

      // Burger Patty
      const pattyGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.4, 32)
      const pattyMat = new THREE.MeshStandardMaterial({ color: 0x4a2311, roughness: 0.8 })
      const patty = new THREE.Mesh(pattyGeo, pattyMat)
      patty.position.y = 0.3
      burgerGroup.add(patty)

      // Bottom Bun
      const botBunGeo = new THREE.CylinderGeometry(1.6, 1.5, 0.4, 32)
      const botBun = new THREE.Mesh(botBunGeo, bunMat)
      botBun.position.y = -0.1
      burgerGroup.add(botBun)

      burgerGroup.position.set(0, 0, 0)
      mainGroup.add(burgerGroup)

      // 2. Floating Orbiting Food Elements (French Fries & Drinks & Spices)
      const floatingElements = []
      const fryGeo = new THREE.BoxGeometry(0.2, 1.4, 0.2)
      const fryMat = new THREE.MeshStandardMaterial({ color: 0xffb703, roughness: 0.3 })

      for (let i = 0; i < 12; i++) {
        const fry = new THREE.Mesh(fryGeo, fryMat)
        const angle = (i / 12) * Math.PI * 2
        fry.position.set(Math.cos(angle) * 5.5, (Math.random() - 0.5) * 4, Math.sin(angle) * 5.5)
        fry.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
        mainGroup.add(fry)
        floatingElements.push({ mesh: fry, angle, speed: 0.008 + Math.random() * 0.008, yBase: fry.position.y, yFreq: 1 + Math.random() * 2, rotSpeed: 0.01 })
      }

      // Background Ambient Particle Field
      const particleGeo = new THREE.BufferGeometry()
      const particleCount = 250
      const posArray = new Float32Array(particleCount * 3)

      for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 30
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
      const particleMat = new THREE.PointsMaterial({
        size: 0.08,
        color: 0xffb703,
        transparent: true,
        opacity: 0.6,
      })
      const particleSystem = new THREE.Points(particleGeo, particleMat)
      scene.add(particleSystem)

      // Mouse Parallax Interaction
      let mouseX = 0
      let mouseY = 0

      handleMouseMove = (e) => {
        const rect = currentMount.getBoundingClientRect()
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
        mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      }

      window.addEventListener('mousemove', handleMouseMove)

      // Animation Loop
      const clock = new THREE.Clock()

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate)
        const elapsedTime = clock.getElapsedTime()

        // Rotate main group smoothly
        mainGroup.rotation.y = elapsedTime * 0.3

        // Parallax camera movement
        camera.position.x += (mouseX * 3 - camera.position.x) * 0.05
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05
        camera.lookAt(scene.position)

        // Animate floating items
        floatingElements.forEach((item) => {
          item.angle += item.speed
          item.mesh.position.x = Math.cos(item.angle) * 5.5
          item.mesh.position.z = Math.sin(item.angle) * 5.5
          item.mesh.position.y = item.yBase + Math.sin(elapsedTime * item.yFreq) * 0.5
          item.mesh.rotation.x += item.rotSpeed
          item.mesh.rotation.y += item.rotSpeed
        })

        // Rotate particle field
        particleSystem.rotation.y = elapsedTime * 0.03

        renderer.render(scene, camera)
      }

      animate()

      // Handle Window Resize
      handleResize = () => {
        if (!currentMount || !renderer) return
        const newW = currentMount.clientWidth
        const newH = currentMount.clientHeight || 500
        camera.aspect = newW / newH
        camera.updateProjectionMatrix()
        renderer.setSize(newW, newH)
      }

      window.addEventListener('resize', handleResize)
    } catch (e) {
      console.warn('Hero3DCanvas Three.js WebGL initialization skipped:', e)
    }

    // Cleanup
    return () => {
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove)
      if (handleResize) window.removeEventListener('resize', handleResize)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      if (renderer && currentMount && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement)
      }
      if (renderer) renderer.dispose()
    }
  }, [])

  return (
    <div className="relative w-full h-[420px] md:h-[500px] overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950/40 shadow-2xl border border-amber-500/20">
      <div ref={mountRef} className="absolute inset-0 z-10 w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* Overlay UI Badges */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none bg-slate-900/80 backdrop-blur-md border border-amber-500/30 px-4 py-2 rounded-full text-xs font-semibold text-amber-400 flex items-center gap-2 shadow-lg">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        3D Real-Time WebGL Engine Active
      </div>

      <div className="absolute bottom-6 right-6 z-20 pointer-events-none bg-slate-900/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-xs text-slate-300 flex items-center gap-3 shadow-xl">
        <span className="text-amber-400 font-bold">💡 Interactive 3D:</span> Move your cursor to rotate camera & explore
      </div>
    </div>
  )
}
