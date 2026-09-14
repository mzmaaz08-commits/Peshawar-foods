import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { X, ShoppingBag, Eye, Sparkles, CheckCircle2 } from 'lucide-react'

export default function Food3DModal({ dish, onClose, onAddToCart }) {
  const mountRef = useRef(null)
  const [added, setAdded] = useState(false)
  const [activeTab, setActiveTab] = useState('3d') // '3d' | 'ingredients'

  useEffect(() => {
    const container = mountRef.current
    if (!container || !dish) return

    const width = container.clientWidth || 400
    const height = container.clientHeight || 320

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.set(0, 2, 7)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambient)

    const spot1 = new THREE.SpotLight(0xffaa00, 3)
    spot1.position.set(5, 10, 5)
    scene.add(spot1)

    const spot2 = new THREE.SpotLight(0x00e5ff, 2)
    spot2.position.set(-5, -5, -5)
    scene.add(spot2)

    // Group for dish model
    const dishGroup = new THREE.Group()
    scene.add(dishGroup)

    // Dynamic Dish Geometry based on category/name
    const category = (dish.category || '').toLowerCase()
    let primaryGeo, primaryMat

    if (category.includes('rice') || category.includes('pulao') || category.includes('biryani')) {
      // Rice Bowl
      const bowlGeo = new THREE.CylinderGeometry(2, 1, 1.2, 32)
      const bowlMat = new THREE.MeshStandardMaterial({ color: 0x22223b, roughness: 0.3, metalness: 0.8 })
      const bowl = new THREE.Mesh(bowlGeo, bowlMat)
      dishGroup.add(bowl)

      // Rice Dome
      const riceGeo = new THREE.SphereGeometry(1.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)
      const riceMat = new THREE.MeshStandardMaterial({ color: 0xfffae0, roughness: 0.8 })
      const rice = new THREE.Mesh(riceGeo, riceMat)
      rice.position.y = 0.5
      dishGroup.add(rice)
    } else if (category.includes('curry') || category.includes('karahi')) {
      // Traditional Karahi Pan
      const panGeo = new THREE.TorusGeometry(1.8, 0.4, 16, 50)
      const panMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.2 })
      const pan = new THREE.Mesh(panGeo, panMat)
      pan.rotation.x = Math.PI / 2
      dishGroup.add(pan)

      const gravyGeo = new THREE.CylinderGeometry(1.7, 1.4, 0.4, 32)
      const gravyMat = new THREE.MeshStandardMaterial({ color: 0x992200, roughness: 0.5 })
      const gravy = new THREE.Mesh(gravyGeo, gravyMat)
      gravy.position.y = -0.1
      dishGroup.add(gravy)
    } else {
      // Gourmet Burger / General Dish
      const platterGeo = new THREE.CylinderGeometry(2.2, 2.0, 0.2, 32)
      const platterMat = new THREE.MeshStandardMaterial({ color: 0x2b2d42, roughness: 0.2 })
      const platter = new THREE.Mesh(platterGeo, platterMat)
      platter.position.y = -0.6
      dishGroup.add(platter)

      const mainObjGeo = new THREE.DodecahedronGeometry(1.3)
      const mainObjMat = new THREE.MeshStandardMaterial({ color: 0xff6b00, metalness: 0.4, roughness: 0.3 })
      const mainObj = new THREE.Mesh(mainObjGeo, mainObjMat)
      mainObj.position.y = 0.4
      dishGroup.add(mainObj)
    }

    // Floating particles
    const particleGroup = new THREE.Group()
    scene.add(particleGroup)

    for (let i = 0; i < 20; i++) {
      const pGeo = new THREE.OctahedronGeometry(0.08 + Math.random() * 0.08)
      const pMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xff8800, emissiveIntensity: 0.5 })
      const p = new THREE.Mesh(pGeo, pMat)
      p.position.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 6)
      particleGroup.add(p)
    }

    // Drag to rotate controls
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0

    const handleMouseDown = (e) => {
      isDragging = true
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const handleMouseMove = (e) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevMouseX
      const deltaY = e.clientY - prevMouseY
      dishGroup.rotation.y += deltaX * 0.01
      dishGroup.rotation.x += deltaY * 0.01
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const handleMouseUp = () => { isDragging = false }

    const domEl = renderer.domElement
    domEl.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!isDragging) {
        dishGroup.rotation.y += 0.008
      }
      particleGroup.rotation.y -= 0.004
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      domEl.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      cancelAnimationFrame(animId)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [dish])

  const handleAdd = () => {
    if (onAddToCart && dish) {
      onAddToCart(dish)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  if (!dish) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-slate-900 border border-amber-500/30 text-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{dish.name}</h3>
              <p className="text-xs text-amber-400 font-semibold">{dish.category || 'Special Dish'} • 3D Interactive Model</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 pt-3 gap-4">
          <button 
            onClick={() => setActiveTab('3d')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === '3d' 
                ? 'border-amber-500 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" /> 3D Viewport
          </button>
          <button 
            onClick={() => setActiveTab('ingredients')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'ingredients' 
                ? 'border-amber-500 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Details & Ingredients
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {activeTab === '3d' ? (
            <div className="relative flex flex-col items-center">
              <div 
                ref={mountRef} 
                className="w-full h-72 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 cursor-grab active:cursor-grabbing overflow-hidden"
              />
              <p className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                Click and drag inside the viewport to rotate dish 360°
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-2 min-h-[280px]">
              <div>
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</h4>
                <p className="text-slate-200 text-sm leading-relaxed">{dish.description || 'Authentically prepared using fresh hand-selected ingredients and traditional spice blends.'}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Ingredients</h4>
                <div className="flex flex-wrap gap-2">
                  {['Fresh Spices', 'Pure Ghee', 'Special Sauce', 'Organic Meat', 'Basmati'].map((ing, idx) => (
                    <span key={idx} className="px-3 py-1 text-xs rounded-full bg-slate-800 text-amber-300 border border-amber-500/20 font-medium">
                      ✓ {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400">Preparation Time</span>
                  <p className="text-sm font-bold text-white">15 - 25 Minutes</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Portion Size</span>
                  <p className="text-sm font-bold text-amber-400">1 - 2 Persons</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-slate-800 bg-slate-950/60">
          <div>
            <span className="text-xs text-slate-400">Price</span>
            <div className="text-2xl font-extrabold text-amber-400">
              {typeof dish.price === 'number' ? `Rs. ${dish.price}` : dish.price}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className={`px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all transform active:scale-95 ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-amber-500/20'
            }`}
          >
            {added ? (
              <>
                <CheckCircle2 className="w-5 h-5" /> Added to Order!
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" /> Add to Order
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
