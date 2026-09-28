import React, { useState } from 'react';
import { HelperWithDistance } from '../context/AppContext';
import { ShieldCheck, Clock, AlertTriangle, UserCheck, Eye, Sparkles } from 'lucide-react';
import { formatDistance } from '../utils/geo';

interface SimulatedMapProps {
  helpers: HelperWithDistance[];
  customerAddress?: string;
  selectedCategoryName?: string;
  onSelectHelper?: (helper: HelperWithDistance) => void;
  onAssignHelper?: (helper: HelperWithDistance) => void;
}

export const SimulatedMap: React.FC<SimulatedMapProps> = ({
  helpers,
  customerAddress = 'Indiranagar 12th Main, Bengaluru',
  selectedCategoryName,
  onSelectHelper,
  onAssignHelper,
}) => {
  const [activePin, setActivePin] = useState<HelperWithDistance | null>(null);
  const [filterRadius, setFilterRadius] = useState<number>(5.0);

  // Center coordinate of SVG map
  const cx = 400;
  const cy = 270;
  const scale = 36; // 36px per km => 5 km = 180px radius circle

  // Map coordinate conversion using lat/lon differences from base customer (12.9716, 77.5946)
  const baseLat = 12.9716;
  const baseLon = 77.5946;

  const getPinCoords = (lat: number, lon: number) => {
    // 1 deg lat ≈ 111 km, 1 deg lon ≈ 108 km
    const dKmY = (lat - baseLat) * 111;
    const dKmX = (lon - baseLon) * 108;

    const x = cx + dKmX * scale;
    // In SVG, positive Y is down, whereas positive latitude is north (up)
    const y = cy - dKmY * scale;

    return { x, y };
  };

  const eligibleCount = helpers.filter((h) => h.isEligibleForCategory).length;
  const excludedDistCount = helpers.filter((h) => h.distanceKm > 5.0).length;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white shadow-sm">
      {/* Top Map Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-950/80 backdrop-blur border-b border-slate-800 z-10 relative">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Simulated 5 km Geo-Radar
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-emerald-400 font-medium">
            {eligibleCount} eligible within 5.0 km
          </span>
          {excludedDistCount > 0 && (
            <span className="text-xs text-amber-400 font-medium">
              ({excludedDistCount} excluded beyond 5 km)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="text-[11px] text-slate-400">Demo map with simulated coordinates</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 border border-slate-700">
            Radius: 5.0 km
          </span>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[520px] select-none overflow-hidden bg-[#0c1424]">
        <svg
          viewBox="0 0 800 540"
          className="w-full h-full object-cover"
          style={{ cursor: 'grab' }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="streetGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" opacity="0.6" />
            </pattern>
            {/* Radar glow */}
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
              <stop offset="70%" stopColor="#10b981" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
            {/* Customer Pin Glow */}
            <radialGradient id="centerPinGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Map Base Texture */}
          <rect width="800" height="540" fill="#0f172a" />
          <rect width="800" height="540" fill="url(#streetGrid)" />

          {/* Simulated Geographic Elements */}
          {/* Ulsoor Lake Water Body (North-West) */}
          <path
            d="M 270 140 C 290 120, 340 130, 330 180 C 320 210, 280 200, 260 170 Z"
            fill="#1e3a5f"
            opacity="0.6"
          />
          <text x="280" y="165" fill="#38bdf8" opacity="0.4" fontSize="10" fontWeight="600">
            Ulsoor Lake
          </text>

          {/* Park area (South-East) */}
          <rect x="520" y="320" width="70" height="50" rx="10" fill="#064e3b" opacity="0.4" />
          <text x="532" y="350" fill="#34d399" opacity="0.4" fontSize="10" fontWeight="600">
            Golf Park
          </text>

          {/* Roads & Avenues */}
          <line x1="80" y1="270" x2="720" y2="270" stroke="#334155" strokeWidth="2.5" />
          <text x="580" y="264" fill="#64748b" fontSize="9" fontWeight="500">
            100 Feet Road
          </text>

          <line x1="400" y1="50" x2="400" y2="490" stroke="#334155" strokeWidth="2.5" />
          <text x="408" y="90" fill="#64748b" fontSize="9" fontWeight="500">
            CMH Road Corridor
          </text>

          {/* Metro Purple Line (diagonal) */}
          <path
            d="M 120 340 L 400 270 L 680 200"
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.7"
          />
          <text x="610" y="190" fill="#c084fc" fontSize="9" fontWeight="500">
            Metro Line
          </text>

          {/* Concentric Distance Rings */}
          {/* 2 km circle */}
          <circle cx={cx} cy={cy} r={2 * scale} fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
          <text x={cx + 2 * scale + 6} y={cy + 4} fill="#64748b" fontSize="9">
            2 km
          </text>

          {/* 3.5 km circle */}
          <circle cx={cx} cy={cy} r={3.5 * scale} fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
          <text x={cx + 3.5 * scale + 6} y={cy + 4} fill="#64748b" fontSize="9">
            3.5 km
          </text>

          {/* 5.0 KM MATCHING PERIMETER CIRCLE (The Crucial Boundary) */}
          <circle
            cx={cx}
            cy={cy}
            r={5.0 * scale}
            fill="url(#radarGlow)"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="8 6"
          />
          <text
            x={cx}
            y={cy - 5.0 * scale - 8}
            fill="#34d399"
            fontSize="11"
            fontWeight="700"
            textAnchor="middle"
            letterSpacing="1"
          >
            5.0 KM MATCHING PERIMETER
          </text>
          <text
            x={cx}
            y={cy + 5.0 * scale + 16}
            fill="#64748b"
            fontSize="9"
            textAnchor="middle"
          >
            Helpers outside this boundary are filtered out
          </text>

          {/* Neighborhood Label Anchors */}
          <text x="360" y="240" fill="#94a3b8" fontSize="11" fontWeight="600">Indiranagar</text>
          <text x="270" y="320" fill="#64748b" fontSize="10">Domlur</text>
          <text x="490" y="220" fill="#64748b" fontSize="10">HAL 2nd Stage</text>
          <text x="360" y="440" fill="#64748b" fontSize="10">Koramangala</text>
          <text x="210" y="490" fill="#64748b" fontSize="10">Jayanagar (6.8 km)</text>
          <text x="590" y="470" fill="#64748b" fontSize="10">HSR Layout (7.5 km)</text>

          {/* Helper Pins */}
          {helpers.map((helper) => {
            const { x, y } = getPinCoords(helper.latitude, helper.longitude);
            const isSelected = activePin?.id === helper.id;
            const isEligible = helper.isEligibleForCategory;
            const isTooFar = helper.distanceKm > 5.0;
            const isUnverifiedSkill = helper.exclusionReason === 'unverified_skill';

            // Marker appearance
            let pinColor = '#10b981'; // green for eligible
            if (isTooFar) pinColor = '#64748b'; // grayed out for distance
            if (isUnverifiedSkill) pinColor = '#f59e0b'; // amber for unverified

            return (
              <g
                key={helper.id}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer transition-all hover:scale-125"
                onClick={() => {
                  setActivePin(helper);
                  if (onSelectHelper) onSelectHelper(helper);
                }}
              >
                {/* Distance line connecting to center if selected */}
                {isSelected && (
                  <line
                    x1={0}
                    y1={0}
                    x2={cx - x}
                    y2={cy - y}
                    stroke={pinColor}
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    opacity="0.8"
                  />
                )}

                {/* Outer halo */}
                <circle
                  cx={0}
                  cy={0}
                  r={isSelected ? 16 : isEligible ? 12 : 9}
                  fill={pinColor}
                  fillOpacity={isSelected ? 0.35 : 0.2}
                />

                {/* Core Pin */}
                <circle
                  cx={0}
                  cy={0}
                  r={isSelected ? 8 : isEligible ? 6 : 5}
                  fill={pinColor}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? 2 : 1.5}
                />

                {/* Helper name label */}
                <text
                  x={0}
                  y={isSelected ? -18 : -10}
                  fill={isSelected ? '#ffffff' : isEligible ? '#e2e8f0' : '#94a3b8'}
                  fontSize={isSelected ? '11' : '9'}
                  fontWeight={isSelected || isEligible ? '700' : '500'}
                  textAnchor="middle"
                  className="pointer-events-none drop-shadow"
                >
                  {helper.name.split(' ')[0]} ({formatDistance(helper.distanceKm)})
                </text>

                {/* Status indicator tag */}
                {isTooFar && (
                  <text
                    x={0}
                    y={16}
                    fill="#ef4444"
                    fontSize="8"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    &gt; 5 km
                  </text>
                )}
                {isUnverifiedSkill && (
                  <text
                    x={0}
                    y={16}
                    fill="#fbbf24"
                    fontSize="8"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    Unverified
                  </text>
                )}
              </g>
            );
          })}

          {/* Customer Center Pin (Origin) */}
          <g transform={`translate(${cx}, ${cy})`}>
            {/* Center pulse */}
            <circle cx={0} cy={0} r={32} fill="url(#centerPinGlow)" />
            <circle cx={0} cy={0} r={18} fill="#0284c7" fillOpacity="0.25" />
            <circle cx={0} cy={0} r={9} fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx={0} cy={0} r={3} fill="#ffffff" />

            <text
              x={0}
              y={-24}
              fill="#38bdf8"
              fontSize="12"
              fontWeight="800"
              textAnchor="middle"
              className="drop-shadow-md"
            >
              YOU (Task Location)
            </text>
            <text
              x={0}
              y={26}
              fill="#94a3b8"
              fontSize="9"
              textAnchor="middle"
            >
              Indiranagar 12th Main
            </text>
          </g>
        </svg>

        {/* Floating Quick Legend */}
        <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur border border-slate-800 rounded-xl p-2.5 text-[11px] text-slate-300 space-y-1 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
            <span>Eligible &amp; Within 5 km</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white" />
            <span>Needs Skill Verification</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500 border border-white" />
            <span>Excluded (&gt; 5 km radius)</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 border border-white" />
            <span>Customer Location (Center)</span>
          </div>
        </div>

        {/* Selected Helper Detail Flyout Overlay */}
        {activePin && (
          <div className="absolute top-3 right-3 w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3.5 shadow-2xl z-20 text-white animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <img
                  src={activePin.avatar}
                  alt={activePin.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-600"
                />
                <div>
                  <h4 className="text-sm font-semibold leading-tight">{activePin.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <span className="text-amber-400 font-medium">★ {activePin.rating}</span>
                    <span>·</span>
                    <span>{activePin.completedTasksCount} tasks</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActivePin(null)}
                className="text-slate-400 hover:text-white p-1 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-1.5 py-2 border-y border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Distance:</span>
                <span className={`font-semibold ${activePin.distanceKm <= 5.0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatDistance(activePin.distanceKm)} {activePin.distanceKm <= 5.0 ? '(Within 5 km)' : '(Beyond 5 km)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rate:</span>
                <span className="font-semibold text-slate-200">
                  ₹{activePin.fixedRateDefault || activePin.hourlyRate} / task
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Verification:</span>
                <span className={`text-[11px] font-medium ${
                  activePin.verificationStatus === 'verified'
                    ? 'text-emerald-400'
                    : activePin.verificationStatus === 'pending'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}>
                  {activePin.verificationStatus === 'verified'
                    ? 'Verified ID'
                    : activePin.verificationStatus === 'pending'
                    ? 'Verification Pending'
                    : 'Not Verified'}
                </span>
              </div>
              {activePin.certificateTitle && (
                <div className="text-[11px] text-slate-400 bg-slate-800/60 p-1.5 rounded">
                  Certificate: {activePin.certificateTitle}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-3 flex items-center gap-2">
              {activePin.isEligibleForCategory ? (
                <button
                  onClick={() => {
                    if (onAssignHelper) onAssignHelper(activePin);
                  }}
                  className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-colors whitespace-nowrap shadow"
                >
                  Assign This Helper
                </button>
              ) : (
                <div className="flex-1 py-1.5 px-2 bg-slate-800 text-slate-400 text-[11px] rounded text-center">
                  {activePin.exclusionReason === 'too_far' && 'Excluded: Distance > 5.0 km'}
                  {activePin.exclusionReason === 'unverified_skill' && 'Qualification Verification Required'}
                  {activePin.exclusionReason === 'unavailable' && 'Helper is currently busy'}
                  {activePin.exclusionReason === 'skill_mismatch' && 'Not registered for this skill'}
                </div>
              )}

              {onSelectHelper && (
                <button
                  onClick={() => onSelectHelper(activePin)}
                  className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 whitespace-nowrap"
                >
                  View Profile
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
