import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Navigation, Star, Search, ExternalLink, Compass, Locate, MessageCircle, CheckCircle, Clock } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { getValidImageUrl, handleImageError, DEFAULT_RESTAURANT_IMAGE } from '../utils/imageHelper'

// Real-world Peshawar GPS Coordinates
const PESHAWAR_CENTER = [34.008, 71.535]

const getPeshawarHubs = (isUrdu) => [
  { name: 'All', label: isUrdu ? 'پورا پشاور' : 'All Peshawar', coords: PESHAWAR_CENTER, zoom: 12 },
  { name: 'Namak Mandi', label: isUrdu ? 'نمک منڈی (باربی کیو اور کڑاہی)' : 'Namak Mandi (BBQ & Karahi)', coords: [34.0093, 71.5794], zoom: 15 },
  { name: 'Saddar Cantt', label: isUrdu ? 'صدر کینٹ' : 'Saddar Cantt', coords: [34.0016, 71.5422], zoom: 15 },
  { name: 'University Road', label: isUrdu ? 'یونیورسٹی روڈ' : 'University Road', coords: [33.9980, 71.4880], zoom: 14 },
  { name: 'Hayatabad', label: isUrdu ? 'حیات آباد فوڈ زون' : 'Hayatabad Food Zone', coords: [33.9850, 71.4350], zoom: 14 },
  { name: 'Karkhano', label: isUrdu ? 'کارخانو مارکیٹ' : 'Karkhano Market', coords: [34.0080, 71.4120], zoom: 15 },
  { name: 'Khyber Road', label: isUrdu ? 'خیبر روڈ / بورڈ' : 'Khyber Road / Board', coords: [34.0210, 71.5600], zoom: 14 }
]

// Fallback GPS mapper for restaurants
const getRestaurantCoords = (res) => {
  const loc = (res.location || res.address || '').toLowerCase()
  const name = (res.name || '').toLowerCase()

  if (loc.includes('namak mandi') || name.includes('charsi')) return [34.0093, 71.5794]
  if (loc.includes('saddar') || loc.includes('cantt') || name.includes('khyber')) return [34.0016, 71.5422]
  if (loc.includes('university') || name.includes('kabul')) return [33.9980, 71.4880]
  if (loc.includes('hayatabad')) return [33.9850, 71.4350]
  if (loc.includes('karkhano') || name.includes('shinwari')) return [34.0080, 71.4120]
  if (loc.includes('charsadda') || name.includes('chapli')) return [34.0320, 71.5650]
  if (loc.includes('khyber road') || name.includes('kotal')) return [34.0210, 71.5600]
  
  // Default offset around Peshawar center
  return [34.008 + (Math.random() * 0.02 - 0.01), 71.535 + (Math.random() * 0.02 - 0.01)]
}

// Calculate Haversine distance in KM
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return (R * c).toFixed(1)
}

export default function PeshawarMap({ restaurants = [] }) {
  const { isUrdu } = useLanguage()
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  const [selectedHub, setSelectedHub] = useState('All')
  const [selectedCuisine, setSelectedCuisine] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [openOnly, setOpenOnly] = useState(false)
  const [userLoc, setUserLoc] = useState(null)
  const [locating, setLocating] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  const hubs = getPeshawarHubs(isUrdu)

  // Filter restaurants
  const filtered = restaurants.filter((r) => {
    const locStr = (r.location || r.address || '').toLowerCase()
    const matchesHub = selectedHub === 'All' || locStr.includes(selectedHub.toLowerCase())
    const matchesCuisine = selectedCuisine === 'All' || r.cuisine === selectedCuisine
    const matchesOpen = !openOnly || r.isOpen !== false
    const matchesQuery =
      !searchQuery ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locStr.includes(searchQuery.toLowerCase()) ||
      (r.cuisine && r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesHub && matchesCuisine && matchesOpen && matchesQuery
  })

  // Ensure Leaflet is loaded from window
  useEffect(() => {
    const checkLeaflet = setInterval(() => {
      if (window.L) {
        setLeafletLoaded(true)
        clearInterval(checkLeaflet)
      }
    }, 200)
    return () => clearInterval(checkLeaflet)
  }, [])

  // Initialize & update Leaflet Map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || mapInstanceRef.current) return

    const L = window.L

    // Initialize Map
    const map = L.map(mapContainerRef.current, {
      center: PESHAWAR_CENTER,
      zoom: 12,
      zoomControl: false,
    })

    // Add Dark Matter Tile Layer (CartoDB)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap & CartoDB',
    }).addTo(map)

    // Add Zoom Control to Top Right
    L.control.zoom({ position: 'topright' }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [leafletLoaded])

  // Update Markers when filtered list or map changes
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletLoaded) return

    const L = window.L
    const map = mapInstanceRef.current

    // Clear previous markers
    markersRef.current.forEach((m) => map.removeLayer(m))
    markersRef.current = []

    // Custom Amber Icon for Restaurants
    const customIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 border-2 border-white shadow-2xl flex items-center justify-center font-black transition-all hover:scale-125">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    })

    filtered.forEach((res) => {
      const coords = getRestaurantCoords(res)
      const dist = userLoc ? calculateDistanceKm(userLoc[0], userLoc[1], coords[0], coords[1]) : null

      const popupHtml = `
        <div style="min-width: 240px; color: #f8fafc; font-family: system-ui, sans-serif;">
          <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
            <img src="${getValidImageUrl(res, DEFAULT_RESTAURANT_IMAGE)}" style="width: 50px; height: 50px; border-radius: 12px; object-fit: cover;" />
            <div>
              <h4 style="margin:0; font-size: 14px; font-weight: 800; color: #fff;">${res.name}</h4>
              <span style="font-size: 11px; color: #f59e0b; font-weight: 700;">${res.location || res.address || 'Peshawar'}</span>
            </div>
          </div>
          
          ${res.specialDish ? `<div style="font-size: 11px; color: #fbbf24; background: rgba(245,158,11,0.1); padding: 4px 8px; border-radius: 6px; margin-bottom: 8px; font-weight: 600;">⭐ Special: ${res.specialDish}</div>` : ''}

          ${dist ? `<div style="font-size: 11px; color: #34d399; font-weight: 700; margin-bottom: 8px;">📍 ${dist} km away from your location</div>` : ''}

          <div style="display: flex; gap: 6px; margin-top: 8px;">
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(res.name + ' Peshawar ' + (res.location || ''))}" target="_blank" style="flex:1; text-align:center; padding: 6px; background: #334155; color: #fff; border-radius: 8px; text-decoration:none; font-size:11px; font-weight:700;">🗺️ Route</a>
            <a href="/restaurant/${res.id}" style="flex:1; text-align:center; padding: 6px; background: #f59e0b; color: #020617; border-radius: 8px; text-decoration:none; font-size:11px; font-weight:800;">Menu ➔</a>
          </div>
        </div>
      `

      const marker = L.marker(coords, { icon: customIcon }).addTo(map)
      marker.bindPopup(popupHtml, {
        className: 'dark-leaflet-popup',
      })
      markersRef.current.push(marker)
    })
  }, [filtered, leafletLoaded, userLoc])

  // Get User Live Location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude]
        setUserLoc(coords)
        setLocating(false)

        if (mapInstanceRef.current && window.L) {
          const map = mapInstanceRef.current
          map.flyTo(coords, 14, { duration: 1.5 })

          const userIcon = window.L.divIcon({
            className: 'user-marker',
            html: `
              <div class="w-10 h-10 rounded-full bg-blue-500 text-white border-2 border-white shadow-2xl flex items-center justify-center font-black animate-pulse">
                📍
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          })

          window.L.marker(coords, { icon: userIcon })
            .addTo(map)
            .bindPopup('<b style="color:#38bdf8;">Your Location</b>')
            .openPopup()
        }
      },
      (err) => {
        setLocating(false)
        alert('Could not fetch GPS location. Please allow location access.')
      }
    )
  }

  // Jump Map to Selected Hub
  const handleHubSelect = (hub) => {
    setSelectedHub(hub.name)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(hub.coords, hub.zoom, { duration: 1.2 })
    }
  }

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden text-slate-100">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
            <Navigation className="w-3.5 h-3.5" /> {isUrdu ? 'لائیو اوپن اسٹریٹ میپ پشاور ایکسپلورر' : 'Real-time OpenStreetMap Peshawar Explorer'}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            {isUrdu ? 'لائیو نقشے پر پشاور کے ریسٹورنٹس تلاش کریں' : 'Locate Peshawar Restaurants On Live Map'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isUrdu ? 'نمک منڈی، صدر، یونیورسٹی روڈ اور شنواری مراکز کے لائیو لوکیشنز دیکھیں۔' : 'Explore live pins for Namak Mandi, Saddar, University Road & Shinwari hubs with GPS Distance tracking.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* User Location Button */}
          <button
            onClick={handleGetLocation}
            disabled={locating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all border border-blue-400/30"
          >
            <Locate className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
            {locating ? (isUrdu ? 'لوکیشن تلاش کی جا رہی ہے...' : 'Locating...') : (isUrdu ? '📍 میرے قریب (جی پی ایس فاصلہ)' : '📍 Near Me (GPS Distance)')}
          </button>

          {/* Search */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isUrdu ? 'نقشے پر جگہ تلاش کریں...' : 'Search map location...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>
      </div>

      {/* Hub Quick Jump Pills */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-amber-500" /> {isUrdu ? 'پشاور کے علاقے:' : 'Peshawar Hubs:'}
        </span>
        {hubs.map((hub, i) => (
          <button
            key={i}
            onClick={() => handleHubSelect(hub)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              selectedHub === hub.name
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-amber-500/50'
            }`}
          >
            {hub.label || hub.name}
          </button>
        ))}
      </div>

      {/* Interactive Map Viewport */}
      <div className="relative w-full h-[450px] sm:h-[500px] rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Loading overlay if leaflet script initializing */}
        {!leafletLoaded && (
          <div className="absolute inset-0 bg-slate-950/90 z-20 flex items-center justify-center flex-col gap-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-amber-400">{isUrdu ? 'اوپن اسٹریٹ میپ لوڈ ہو رہا ہے...' : 'Loading OpenStreetMap Peshawar...'}</p>
          </div>
        )}
      </div>

      {/* Map Footer Summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-2 gap-3 border-t border-slate-800/80">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          {isUrdu ? `پشاور بھر میں ${filtered.length} لائیو ریسٹورنٹ پنز دکھائے جا رہے ہیں` : `Showing ${filtered.length} live restaurant pins across Peshawar`}
        </span>

        {userLoc && (
          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            {isUrdu ? '✅ جی پی ایس ایکٹیو — کلو میٹرز میں فاصلہ دکھایا جا رہا ہے' : '✅ GPS Active — Showing distance in km to restaurants'}
          </span>
        )}
      </div>

      {/* Custom Leaflet Dark Popup CSS Injection */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background: #0f172a !important;
          border: 1px solid #334155 !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5) !important;
          padding: 4px !important;
        }
        .leaflet-popup-tip {
          background: #0f172a !important;
        }
        .leaflet-popup-content {
          margin: 10px 12px !important;
        }
      `}</style>
    </div>
  )
}
