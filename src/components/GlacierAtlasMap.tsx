import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Layers,
  Compass,
  Filter,
  Search,
  Plus,
  Activity,
  Globe2,
  Maximize2,
  Radio,
  Sliders,
  Sparkles,
  ExternalLink,
  X,
  CheckCircle2,
  Database,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface ResearchStation {
  id: string;
  name: string;
  region: string;
  coordinates: { lat: number; lng: number };
  xPercent: number; // For responsive map projection (0-100%)
  yPercent: number; // For responsive map projection (0-100%)
  type: 'mineralization' | 'ocean_buoy' | 'sensor_array' | 'direct_air_capture' | 'academic_lab';
  status: 'operational' | 'calibrating' | 'planned';
  sdg: string;
  leadInstitution: string;
  telemetry: {
    metricName: string;
    currentValue: string;
    targetValue: string;
    trend: 'up' | 'down' | 'stable';
    lastUpdated: string;
  };
  summary: string;
}

const INITIAL_STATIONS: ResearchStation[] = [
  {
    id: 'st-iceland',
    name: 'Hellisheiði Basalt Mineralization Facility',
    region: 'Hengill Volcano, Iceland',
    coordinates: { lat: 64.04, lng: -21.40 },
    xPercent: 44,
    yPercent: 22,
    type: 'mineralization',
    status: 'operational',
    sdg: 'SDG 13 Climate Action',
    leadInstitution: 'Reykjavik Energy & Black Mesa',
    telemetry: {
      metricName: 'CO₂ Dissolution Permanence',
      currentValue: '12,450 t/yr',
      targetValue: '15,000 t/yr',
      trend: 'up',
      lastUpdated: '8 mins ago'
    },
    summary: 'Active deep-well CO₂ injection into volcanic basalt formations, turning carbon dioxide into permanent solid limestone within two years.'
  },
  {
    id: 'st-barrier-reef',
    name: 'Coral Sea Ocean Alkalinity Buoy #4',
    region: 'Great Barrier Reef, Australia',
    coordinates: { lat: -18.28, lng: 147.70 },
    xPercent: 86,
    yPercent: 68,
    type: 'ocean_buoy',
    status: 'operational',
    sdg: 'SDG 14 Life Below Water',
    leadInstitution: 'James Cook University',
    telemetry: {
      metricName: 'Surface Ocean pH & Carbonate',
      currentValue: '8.14 pH',
      targetValue: '8.20 pH',
      trend: 'stable',
      lastUpdated: '2 mins ago'
    },
    summary: 'Solar-powered autonomous ocean buoy monitoring ocean acidification mitigation and micro-alkalinity enhancement trials.'
  },
  {
    id: 'st-permian',
    name: 'Permian Basin Sentinel Methane Array',
    region: 'West Texas / New Mexico, USA',
    coordinates: { lat: 31.86, lng: -102.36 },
    xPercent: 22,
    yPercent: 38,
    type: 'sensor_array',
    status: 'operational',
    sdg: 'SDG 7 Clean Energy',
    leadInstitution: 'MIT Energy Initiative',
    telemetry: {
      metricName: 'Methane Plume Detection Index',
      currentValue: '1.82 ppm',
      targetValue: '< 1.90 ppm',
      trend: 'down',
      lastUpdated: '14 mins ago'
    },
    summary: 'Cross-calibrated ground laser spectrometers aligned with ESA Sentinel-5P satellite passes to detect fugitives and eliminate leaks.'
  },
  {
    id: 'st-svalbard',
    name: 'Svalbard Arctic Cryosphere Array',
    region: 'Longyearbyen, Norway',
    coordinates: { lat: 78.22, lng: 15.65 },
    xPercent: 52,
    yPercent: 12,
    type: 'academic_lab',
    status: 'operational',
    sdg: 'SDG 15 Life On Land',
    leadInstitution: 'University of Oslo & Glacier Consortium',
    telemetry: {
      metricName: 'Permafrost Core Temp',
      currentValue: '-3.8 °C',
      targetValue: '< -4.0 °C',
      trend: 'stable',
      lastUpdated: '1 hour ago'
    },
    summary: 'Sub-surface cryogenic sensors and genomic soil sequencing analyzing polar carbon feedback loops.'
  },
  {
    id: 'st-atacama',
    name: 'Atacama Direct Air Scrubbing Complex',
    region: 'Antofagasta, Chile',
    coordinates: { lat: -23.86, lng: -69.13 },
    xPercent: 29,
    yPercent: 74,
    type: 'direct_air_capture',
    status: 'operational',
    sdg: 'SDG 9 Innovation',
    leadInstitution: 'Pontificia Universidad Católica',
    telemetry: {
      metricName: 'Solar-Powered DAC Capture',
      currentValue: '8,200 t/yr',
      targetValue: '10,000 t/yr',
      trend: 'up',
      lastUpdated: '25 mins ago'
    },
    summary: 'Harnessing the world’s highest solar irradiance to power modular metal-organic framework (MOF) solid sorbent air filters.'
  },
  {
    id: 'st-amazon',
    name: 'Amazon Tall Tower Biosphere Observatory',
    region: 'Manaus, Brazil',
    coordinates: { lat: -2.14, lng: -60.01 },
    xPercent: 32,
    yPercent: 54,
    type: 'sensor_array',
    status: 'operational',
    sdg: 'SDG 15 Life on Land',
    leadInstitution: 'INPA & Max Planck Institute',
    telemetry: {
      metricName: 'Canopy Canopy CO₂ Flux',
      currentValue: '-4.2 µmol/m²s',
      targetValue: '-5.0 µmol/m²s',
      trend: 'up',
      lastUpdated: '40 mins ago'
    },
    summary: '325-meter atmospheric sampling mast capturing continuous greenhouse gas exchanges and volatile organic compounds across pristine rainforest.'
  }
];

export default function GlacierAtlasMap() {
  const [stations, setStations] = useState<ResearchStation[]>(INITIAL_STATIONS);
  const [selectedStation, setSelectedStation] = useState<ResearchStation | null>(INITIAL_STATIONS[0]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite'>('dark');
  const [showAddStationModal, setShowAddStationModal] = useState(false);
  const [newStation, setNewStation] = useState({
    name: '',
    region: '',
    lat: '',
    lng: '',
    type: 'sensor_array' as ResearchStation['type'],
    summary: ''
  });

  const filteredStations = stations.filter(s => {
    const matchesFilter = selectedFilter === 'all' || s.type === selectedFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStation.name.trim()) return;

    const latNum = parseFloat(newStation.lat) || 0;
    const lngNum = parseFloat(newStation.lng) || 0;

    // Convert lat/lng to percentage bounds
    const xPct = Math.max(5, Math.min(95, ((lngNum + 180) / 360) * 100));
    const yPct = Math.max(10, Math.min(90, ((90 - latNum) / 180) * 100));

    const station: ResearchStation = {
      id: 'st-' + Date.now(),
      name: newStation.name.trim(),
      region: newStation.region.trim() || 'Global Coordinates',
      coordinates: { lat: latNum, lng: lngNum },
      xPercent: xPct,
      yPercent: yPct,
      type: newStation.type,
      status: 'operational',
      sdg: 'SDG 13 Climate Action',
      leadInstitution: 'Glacier Consortium Field Team',
      telemetry: {
        metricName: 'Active Field Telemetry',
        currentValue: 'Calibrated',
        targetValue: 'Nominal',
        trend: 'stable',
        lastUpdated: 'Just now'
      },
      summary: newStation.summary.trim() || 'Newly deployed scientific field telemetry station.'
    };

    setStations(prev => [station, ...prev]);
    setSelectedStation(station);
    setShowAddStationModal(false);
    setNewStation({ name: '', region: '', lat: '', lng: '', type: 'sensor_array', summary: '' });
  };

  return (
    <div className="w-full bg-[#0a0f18] text-white rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
      
      {/* Top Atlas Header Bar */}
      <div className="bg-[#111927] px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-lg text-white">Glacier Global Atlas & Field Stations</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider border border-cyan-500/30">
                Google Maps Grounding
              </span>
            </div>
            <p className="text-xs text-white/50">
              Interactive planetary telemetry network linking research stations, ocean buoys, and sensor arrays
            </p>
          </div>
        </div>

        {/* Map Style & Station Count */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-black/40 p-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => setMapStyle('dark')}
              className={cn(
                "px-3 py-1.5 rounded-xl font-medium transition-all",
                mapStyle === 'dark' ? "bg-cyan-600 text-white font-bold shadow" : "text-white/50 hover:text-white"
              )}
            >
              Dark Matrix
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={cn(
                "px-3 py-1.5 rounded-xl font-medium transition-all",
                mapStyle === 'satellite' ? "bg-cyan-600 text-white font-bold shadow" : "text-white/50 hover:text-white"
              )}
            >
              Satellite Layer
            </button>
          </div>

          <button
            onClick={() => setShowAddStationModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Deploy Station</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Sub-bar */}
      <div className="px-6 py-3 bg-[#0d1422] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'All Stations' },
            { id: 'mineralization', label: 'Mineralization' },
            { id: 'ocean_buoy', label: 'Ocean Buoys' },
            { id: 'sensor_array', label: 'Sensor Arrays' },
            { id: 'direct_air_capture', label: 'Direct Air Capture' },
            { id: 'academic_lab', label: 'Academic Labs' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl whitespace-nowrap transition-all",
                selectedFilter === f.id
                  ? "bg-white/15 text-white font-bold border border-white/20"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="bg-black/40 rounded-xl px-3 py-1.5 border border-white/10 flex items-center gap-2 text-white/50 w-full sm:w-64">
          <Search className="w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search stations or regions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-white/30 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Main Work Area: Interactive Map Canvas + Details Drawer */}
      <div className="relative h-[560px] w-full flex overflow-hidden">
        
        {/* Map Canvas Background */}
        <div className={cn(
          "flex-1 relative overflow-hidden transition-all duration-500",
          mapStyle === 'satellite' 
            ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0d2847] via-[#051329] to-[#020b18]" 
            : "bg-[#070c14]"
        )}>
          {/* World Map Vector Grid Illustration */}
          <div 
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#38bdf8 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              backgroundPosition: '0 0, 20px 20px'
            }}
          />

          {/* Stylized Continents Shape Paths */}
          <svg className="w-full h-full opacity-35 select-none pointer-events-none" viewBox="0 0 1000 500" fill="none">
            {/* North America */}
            <path d="M120 80 Q 200 70 260 110 T 280 200 T 220 280 Q 150 240 100 160 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            {/* South America */}
            <path d="M260 260 Q 340 280 340 370 T 280 470 Q 240 400 240 320 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            {/* Europe */}
            <path d="M440 80 Q 520 60 560 120 T 500 190 Q 420 180 430 110 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            {/* Africa */}
            <path d="M440 200 Q 550 200 560 290 T 510 410 Q 440 380 420 270 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            {/* Asia */}
            <path d="M580 80 Q 750 60 850 140 T 780 280 Q 640 260 590 170 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            {/* Australia */}
            <path d="M780 330 Q 880 320 880 410 T 780 440 Q 740 390 760 340 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          </svg>

          {/* Interactive Station Markers */}
          {filteredStations.map(st => {
            const isSelected = selectedStation?.id === st.id;
            return (
              <motion.div
                key={st.id}
                style={{ left: `${st.xPercent}%`, top: `${st.yPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                onClick={() => setSelectedStation(st)}
                whileHover={{ scale: 1.25 }}
              >
                {/* Ping animation ring */}
                <div className={cn(
                  "w-8 h-8 rounded-full absolute -inset-2 animate-ping opacity-40",
                  st.type === 'mineralization' ? "bg-emerald-400" :
                  st.type === 'ocean_buoy' ? "bg-cyan-400" :
                  st.type === 'direct_air_capture' ? "bg-purple-400" : "bg-indigo-400"
                )} />

                {/* Marker Pin */}
                <div className={cn(
                  "w-7 h-7 rounded-2xl flex items-center justify-center shadow-xl border-2 transition-transform duration-200",
                  isSelected
                    ? "bg-white text-black border-cyan-400 scale-125 ring-4 ring-cyan-500/30"
                    : st.type === 'mineralization'
                    ? "bg-emerald-500 border-white text-white"
                    : st.type === 'ocean_buoy'
                    ? "bg-cyan-500 border-white text-white"
                    : st.type === 'direct_air_capture'
                    ? "bg-purple-600 border-white text-white"
                    : "bg-indigo-600 border-white text-white"
                )}>
                  <MapPin className="w-3.5 h-3.5 fill-current" />
                </div>

                {/* Mini Hover Label */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#111927]/95 border border-white/20 text-white px-2.5 py-1 rounded-xl text-[10px] whitespace-nowrap shadow-xl pointer-events-none z-30 font-bold">
                  {st.name}
                </div>
              </motion.div>
            );
          })}

          {/* Compass Rose UI Badge */}
          <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10 flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>GEO-GRID: WGS-84 ACTIVE</span>
          </div>

          {/* Live Telemetry Ping Counter */}
          <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white">{stations.length} Active Nodes</span>
            </div>
            <span className="text-white/30">•</span>
            <span className="text-white/60 font-mono text-[11px]">Next Satellite Pass in 18m</span>
          </div>
        </div>

        {/* Selected Station Drawer Panel */}
        <AnimatePresence>
          {selectedStation && (
            <motion.div
              initial={{ x: 340, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 340, opacity: 0 }}
              className="w-80 md:w-96 bg-[#111927] border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto z-30 shadow-2xl"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] font-bold font-mono text-cyan-400 uppercase tracking-widest">
                    Telemetry Node #{selectedStation.id}
                  </span>
                  <button 
                    onClick={() => setSelectedStation(null)}
                    className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      {selectedStation.status}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white leading-tight">
                    {selectedStation.name}
                  </h3>
                  <p className="text-xs text-white/50 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{selectedStation.region}</span>
                  </p>
                </div>

                {/* Telemetry Metric Spotlight Card */}
                <div className="p-4 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-2">
                  <div className="text-[10px] text-white/40 font-mono uppercase tracking-wider flex justify-between">
                    <span>{selectedStation.telemetry.metricName}</span>
                    <span className="text-cyan-400">Live</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-display font-bold text-white">
                      {selectedStation.telemetry.currentValue}
                    </span>
                    <span className="text-xs text-white/50 font-mono">
                      Target: {selectedStation.telemetry.targetValue}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/40 font-mono">
                    Telemetry synced {selectedStation.telemetry.lastUpdated}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-white/60">
                    <span>Coordinates</span>
                    <span className="font-mono text-white">
                      {selectedStation.coordinates.lat.toFixed(2)}°N, {selectedStation.coordinates.lng.toFixed(2)}°E
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-white/60">
                    <span>Primary SDG</span>
                    <span className="text-cyan-300 font-bold">{selectedStation.sdg}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 text-white/60">
                    <span>Lead Consortium</span>
                    <span className="text-white text-right max-w-[180px] truncate">{selectedStation.leadInstitution}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    Mission Scope
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed font-sans">
                    {selectedStation.summary}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => alert(`Exporting calibrated telemetry logs for ${selectedStation.name} as CSV & NetCDF4 package.`)}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all"
                >
                  <Database className="w-4 h-4" />
                  <span>Download Telemetry Dataset</span>
                </button>
                <button
                  onClick={() => alert(`Opened Google Maps coordinate route to ${selectedStation.coordinates.lat}, ${selectedStation.coordinates.lng}`)}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View in Google Maps Coordinate Viewer</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Deploy Station Modal */}
      <AnimatePresence>
        {showAddStationModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddStationModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#111927] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4 text-white"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-base">Deploy Field Telemetry Station</h3>
                </div>
                <button onClick={() => setShowAddStationModal(false)} className="p-1 hover:bg-white/10 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddStation} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-white/60 font-semibold">Station Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sub-Antarctic Marine Salinity Array"
                    value={newStation.name}
                    onChange={e => setNewStation({ ...newStation, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-white/60 font-semibold">Latitude (°N/S)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. -54.28"
                      value={newStation.lat}
                      onChange={e => setNewStation({ ...newStation, lat: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/60 font-semibold">Longitude (°E/W)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. -36.50"
                      value={newStation.lng}
                      onChange={e => setNewStation({ ...newStation, lng: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-white/60 font-semibold">Region / Territory</label>
                    <input
                      type="text"
                      placeholder="e.g. South Georgia Island"
                      value={newStation.region}
                      onChange={e => setNewStation({ ...newStation, region: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/60 font-semibold">Station Type</label>
                    <select
                      value={newStation.type}
                      onChange={e => setNewStation({ ...newStation, type: e.target.value as any })}
                      className="w-full bg-[#0a0f18] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="sensor_array">Sensor Array</option>
                      <option value="ocean_buoy">Ocean Buoy</option>
                      <option value="mineralization">Mineralization Site</option>
                      <option value="direct_air_capture">Direct Air Capture</option>
                      <option value="academic_lab">Academic Lab</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-white/60 font-semibold">Scientific Focus & Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe scientific equipment, sensors, and telemetry targets..."
                    value={newStation.summary}
                    onChange={e => setNewStation({ ...newStation, summary: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAddStationModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg"
                  >
                    Register & Activate Node
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
