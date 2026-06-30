/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Zap, Shield, Activity, Droplets, 
  Car, Eye, Radio, Server, Compass, AlertTriangle, 
  MapPin, CheckCircle2, TrendingUp, Info 
} from 'lucide-react';
import { CivicIssue } from '../types';

interface IsometricCityProps {
  activeIssues: CivicIssue[];
  onSelectIssue?: (issue: CivicIssue) => void;
  selectedIssueId?: string | null;
}

interface CityBuilding {
  id: string;
  name: string;
  gridX: number; // 0 to 4
  gridY: number; // 0 to 4
  width: number; // in grid cells
  length: number; // in grid cells
  height: number; // visual height scale
  color: string;
  cyberColor: string;
  type: 'government' | 'health' | 'utility' | 'residential' | 'commercial' | 'tech';
  description: string;
  metrics: { label: string; value: string; status: 'nominal' | 'warning' | 'alert' }[];
}

export default function IsometricCity({ activeIssues, onSelectIssue, selectedIssueId }: IsometricCityProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<CityBuilding | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<{ type: 'building' | 'issue'; name: string } | null>(null);
  const [isWireframe, setIsWireframe] = useState<boolean>(true);
  const [cityAlertLevel, setCityAlertLevel] = useState<'LOW' | 'MODERATE' | 'HIGH'>('LOW');
  const [scanningActive, setScanningActive] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  // Core smart city districts
  const BUILDINGS: CityBuilding[] = [
    {
      id: 'town-hall',
      name: 'Civic HQ & Town Hall',
      gridX: 2,
      gridY: 2,
      width: 1.2,
      length: 1.2,
      height: 80,
      color: '#4f46e5',
      cyberColor: '#00f0ff',
      type: 'government',
      description: 'Central Administrative Headquarters. Hosts digital democracy servers and government dashboards.',
      metrics: [
        { label: 'Citizen Portal Load', value: '1.24 GB/s', status: 'nominal' },
        { label: 'AI Resolution Rate', value: '94.2%', status: 'nominal' },
        { label: 'Pending Petitions', value: '3 Active', status: 'nominal' }
      ]
    },
    {
      id: 'power-station',
      name: 'Nexus Fusion Grid',
      gridX: 0,
      gridY: 1,
      width: 1,
      length: 1,
      height: 100,
      color: '#eab308',
      cyberColor: '#fbbf24',
      type: 'utility',
      description: 'Smart power plant utilizing local renewable feeds. Monitors the regional grid output.',
      metrics: [
        { label: 'Grid Feed Status', value: '98.4% Stable', status: 'nominal' },
        { label: 'Load Capacity', value: '412 MW / 500 MW', status: 'nominal' },
        { label: 'AI Dispatch Eff.', value: '99.8%', status: 'nominal' }
      ]
    },
    {
      id: 'hospital',
      name: 'BioPulse Medical Hub',
      gridX: 4,
      gridY: 0,
      width: 1.2,
      length: 1,
      height: 70,
      color: '#ef4444',
      cyberColor: '#f87171',
      type: 'health',
      description: 'Regional level-1 response hospital. Seamlessly linked to transit response nodes.',
      metrics: [
        { label: 'Response Unit Readiness', value: '100%', status: 'nominal' },
        { label: 'Telemetry Diagnostics', value: 'Nominal', status: 'nominal' },
        { label: 'Critical Supply Reserv.', value: '89%', status: 'nominal' }
      ]
    },
    {
      id: 'tech-park',
      name: 'Elysium Quantum Incubator',
      gridX: 0,
      gridY: 4,
      width: 1.5,
      length: 1,
      height: 120,
      color: '#06b6d4',
      cyberColor: '#38bdf8',
      type: 'tech',
      description: 'R&D cluster. Powering the CivicPulse AI neural-net classification engine.',
      metrics: [
        { label: 'Cognitive Engine Latency', value: '14ms', status: 'nominal' },
        { label: 'Simulated Model Integrity', value: '99.98%', status: 'nominal' },
        { label: 'Compute Allocation', value: '82%', status: 'nominal' }
      ]
    },
    {
      id: 'transit-hub',
      name: 'HyperLoop Central Transit',
      gridX: 3,
      gridY: 4,
      width: 1.3,
      length: 1,
      height: 50,
      color: '#10b981',
      cyberColor: '#34d399',
      type: 'commercial',
      description: 'Autonomous logistics and rapid transport interchange. Powered by real-time vehicle mapping.',
      metrics: [
        { label: 'Autonomous Vehicle Fleet', value: '142 Active', status: 'nominal' },
        { label: 'Flow Optimization', value: '+18.4% Efficiency', status: 'nominal' },
        { label: 'Congestion Indices', value: '0.12 (Zero Grid)', status: 'nominal' }
      ]
    },
    {
      id: 'residential-east',
      name: 'EcoShelter Block Alpha',
      gridX: 4,
      gridY: 2,
      width: 1,
      length: 1,
      height: 90,
      color: '#ec4899',
      cyberColor: '#f472b6',
      type: 'residential',
      description: 'Modular, energy-neutral sustainable residential district utilizing smart meters.',
      metrics: [
        { label: 'Water Pressure', value: '4.2 Bar', status: 'nominal' },
        { label: 'Renewable Storage Load', value: '72% Charged', status: 'nominal' },
        { label: 'Waste Management Sync', value: 'Automated', status: 'nominal' }
      ]
    }
  ];

  // Map coordinates in isometric space
  // Canvas drawing dimensions
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: Math.max(450, containerRef.current.clientHeight)
        });
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Sync city alert level based on unresolved active issues
  useEffect(() => {
    const criticalCount = activeIssues.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;
    const activeCount = activeIssues.filter(i => i.status !== 'resolved').length;

    if (criticalCount > 0 || activeCount > 6) {
      setCityAlertLevel('HIGH');
    } else if (activeCount > 2) {
      setCityAlertLevel('MODERATE');
    } else {
      setCityAlertLevel('LOW');
    }
  }, [activeIssues]);

  // Main interactive render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    // Grid center and coordinate helpers
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2 + 30;
    const tileWidth = 80; // Size of isometric tile
    const tileHeight = 40;

    // Convert local grid to Isometric projection coords
    const toIso = (gx: number, gy: number, heightOffset = 0) => {
      // Offset grid to center it
      const xo = (gx - 2) * tileWidth;
      const yo = (gy - 2) * tileHeight;
      return {
        x: centerX + (xo - yo),
        y: centerY + (xo + yo) / 2 - heightOffset
      };
    };

    // Hover mouse tracking
    let mouseX = -1;
    let mouseY = -1;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseClick = () => {
      // Check if we clicked on an issue marker or a building
      let foundEntity = false;

      // 1. Check issue markers (higher z-index override)
      const visibleIssues = activeIssues.filter(i => i.status !== 'resolved');
      for (const issue of visibleIssues) {
        const issueGridX = (issue.location.lat % 5);
        const issueGridY = (issue.location.lng % 5);
        const pt = toIso(issueGridX, issueGridY, 30 + Math.sin(time * 0.08) * 4);

        const dist = Math.hypot(pt.x - mouseX, pt.y - mouseY);
        if (dist < 15) {
          if (onSelectIssue) onSelectIssue(issue);
          foundEntity = true;
          // Trigger instant drone scan animation
          setScanningActive(true);
          setTimeout(() => setScanningActive(false), 1500);
          break;
        }
      }

      if (foundEntity) return;

      // 2. Check buildings
      for (const b of BUILDINGS) {
        const basePt = toIso(b.gridX + b.width / 2, b.gridY + b.length / 2);
        // Approximate a bounding box for the isometric tower
        const h = b.height;
        const poly = [
          { x: basePt.x - tileWidth * 0.7, y: basePt.y },
          { x: basePt.x, y: basePt.y - tileHeight * 0.7 },
          { x: basePt.x + tileWidth * 0.7, y: basePt.y },
          { x: basePt.x, y: basePt.y + tileHeight * 0.7 },
          { x: basePt.x + tileWidth * 0.7, y: basePt.y - h },
          { x: basePt.x, y: basePt.y - tileHeight * 0.7 - h },
          { x: basePt.x - tileWidth * 0.7, y: basePt.y - h }
        ];

        // Raycasting for polygon intersection
        let inside = false;
        // Simple radial check first for optimal performance
        const distToCenter = Math.hypot(basePt.x - mouseX, (basePt.y - h / 2) - mouseY);
        if (distToCenter < 65) {
          setSelectedBuilding(b);
          foundEntity = true;
          break;
        }
      }

      if (!foundEntity) {
        setSelectedBuilding(null);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);

    // Particle pool for background auroras & telemetry data packets
    const dataPackets: { x: number; y: number; tx: number; ty: number; progress: number; color: string; speed: number }[] = [];

    const drawLoop = () => {
      time += 0.05 * simulationSpeed;
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // 1. Draw glowing background grid & Aurora flares
      if (isWireframe) {
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);

        // Grid scan line glow
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.lineWidth = 1;
        for (let i = 0; i < dimensions.width; i += 40) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, dimensions.height);
          ctx.stroke();
        }

        // Draw ambient aurora aura (glowing cyan / blue light in center)
        const gradient = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, 350);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.04)');
        gradient.addColorStop(0.5, 'rgba(14, 116, 144, 0.04)');
        gradient.addColorStop(1, 'rgba(2, 6, 23, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 350, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Solar Minimal background
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);

        const gradient = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, 300);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.05)');
        gradient.addColorStop(1, 'rgba(248, 250, 252, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 300, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw ground isometric grid system (5x5 cells)
      const gridSize = 5;
      ctx.lineWidth = 1;

      for (let x = 0; x <= gridSize; x++) {
        const startIso = toIso(x, 0);
        const endIso = toIso(x, gridSize);
        ctx.strokeStyle = isWireframe ? 'rgba(30, 41, 59, 0.7)' : 'rgba(226, 232, 240, 0.8)';
        ctx.beginPath();
        ctx.moveTo(startIso.x, startIso.y);
        ctx.lineTo(endIso.x, endIso.y);
        ctx.stroke();
      }

      for (let y = 0; y <= gridSize; y++) {
        const startIso = toIso(0, y);
        const endIso = toIso(gridSize, y);
        ctx.strokeStyle = isWireframe ? 'rgba(30, 41, 59, 0.7)' : 'rgba(226, 232, 240, 0.8)';
        ctx.beginPath();
        ctx.moveTo(startIso.x, startIso.y);
        ctx.lineTo(endIso.x, endIso.y);
        ctx.stroke();
      }

      // 3. Draw automated vehicles (Neon packets travelling roads)
      const drawVehicles = () => {
        // Simple routes along grid edges
        const routes = [
          { from: { x: 0, y: 1 }, to: { x: 4, y: 1 } },
          { from: { x: 3, y: 0 }, to: { x: 3, y: 4 } },
          { from: { x: 4, y: 2 }, to: { x: 0, y: 2 } }
        ];

        routes.forEach((route, index) => {
          const t = (time * 0.04 + index * 0.3) % 1.0;
          const gx = route.from.x + (route.to.x - route.from.x) * t;
          const gy = route.from.y + (route.to.y - route.from.y) * t;
          const pt = toIso(gx, gy, 0);

          // Render miniature vehicle dot with light tail
          ctx.shadowBlur = isWireframe ? 10 : 0;
          ctx.shadowColor = isWireframe ? '#00f0ff' : 'transparent';
          ctx.fillStyle = isWireframe ? '#00f0ff' : '#4f46e5';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
          ctx.fill();

          // Tail
          ctx.strokeStyle = isWireframe ? 'rgba(0, 240, 255, 0.3)' : 'rgba(79, 70, 229, 0.2)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          const prevPt = toIso(gx - (route.to.x - route.from.x) * 0.08, gy - (route.to.y - route.from.y) * 0.08);
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(prevPt.x, prevPt.y);
          ctx.stroke();
          ctx.shadowBlur = 0; // reset
        });
      };
      drawVehicles();

      // 4. Draw buildings (Towers with structural volume)
      let hoveredB: CityBuilding | null = null;

      BUILDINGS.forEach((b) => {
        const basePt = toIso(b.gridX + b.width / 2, b.gridY + b.length / 2);
        const w = tileWidth * b.width * 0.6;
        const l = tileHeight * b.length * 1.2;
        const h = b.height;

        const isBSelected = selectedBuilding?.id === b.id;

        // Hover detection on building center
        const isBHovered = Math.hypot(basePt.x - mouseX, (basePt.y - h / 2) - mouseY) < 55;
        if (isBHovered) hoveredB = b;

        const activeColor = isWireframe ? b.cyberColor : b.color;

        // Visual design: Render 3D isometric box
        // Drawing faces from back to front (top down)
        const topCenter = { x: basePt.x, y: basePt.y - h };
        
        // Define isometric polygon points for faces
        const leftFace = [
          { x: basePt.x - w, y: basePt.y },
          { x: basePt.x, y: basePt.y + l / 2 },
          { x: basePt.x, y: basePt.y + l / 2 - h },
          { x: basePt.x - w, y: basePt.y - h }
        ];

        const rightFace = [
          { x: basePt.x, y: basePt.y + l / 2 },
          { x: basePt.x + w, y: basePt.y },
          { x: basePt.x + w, y: basePt.y - h },
          { x: basePt.x, y: basePt.y + l / 2 - h }
        ];

        const topFace = [
          { x: basePt.x - w, y: basePt.y - h },
          { x: basePt.x, y: basePt.y + l / 2 - h },
          { x: basePt.x + w, y: basePt.y - h },
          { x: basePt.x, y: basePt.y - l / 2 - h }
        ];

        const drawFace = (poly: {x: number; y: number}[], fill: string, stroke: string, width = 1) => {
          ctx.beginPath();
          ctx.moveTo(poly[0].x, poly[0].y);
          for (let i = 1; i < poly.length; i++) {
            ctx.lineTo(poly[i].x, poly[i].y);
          }
          ctx.closePath();
          ctx.fillStyle = fill;
          ctx.fill();
          ctx.strokeStyle = stroke;
          ctx.lineWidth = width;
          ctx.stroke();
        };

        // Render base shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.ellipse(basePt.x, basePt.y + l / 4, w, l / 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Colors based on style
        let faceLeftColor = isWireframe ? 'rgba(15, 23, 42, 0.85)' : '#e2e8f0';
        let faceRightColor = isWireframe ? 'rgba(15, 23, 42, 0.7)' : '#cbd5e1';
        let faceTopColor = isWireframe ? 'rgba(30, 41, 59, 0.9)' : '#f1f5f9';
        let strokeColor = isWireframe ? 'rgba(255, 255, 255, 0.15)' : 'rgba(148, 163, 184, 0.5)';

        if (isBHovered || isBSelected) {
          faceLeftColor = isWireframe ? 'rgba(15, 118, 110, 0.4)' : `${activeColor}15`;
          faceRightColor = isWireframe ? 'rgba(15, 118, 110, 0.3)' : `${activeColor}25`;
          faceTopColor = isWireframe ? 'rgba(13, 148, 136, 0.5)' : `${activeColor}35`;
          strokeColor = activeColor;
        }

        // Draw 3D faces
        drawFace(leftFace, faceLeftColor, strokeColor, (isBHovered || isBSelected) ? 1.5 : 1);
        drawFace(rightFace, faceRightColor, strokeColor, (isBHovered || isBSelected) ? 1.5 : 1);
        drawFace(topFace, faceTopColor, strokeColor, (isBHovered || isBSelected) ? 1.5 : 1);

        // Digital telemetry markers / neon wire lines
        if (isWireframe) {
          // Neon power conduit vertical line
          ctx.strokeStyle = (isBHovered || isBSelected) ? activeColor : 'rgba(148, 163, 184, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(basePt.x, basePt.y + l / 2);
          ctx.lineTo(basePt.x, basePt.y + l / 2 - h);
          ctx.stroke();

          // Ambient node light on top of building
          ctx.shadowBlur = 8;
          ctx.shadowColor = activeColor;
          ctx.fillStyle = activeColor;
          ctx.beginPath();
          ctx.arc(basePt.x, basePt.y - h - l / 4, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 5. Draw active civic issue hotspots (pulsing markers on the grid)
      const visibleIssues = activeIssues.filter(i => i.status !== 'resolved');
      let hoveredI: CivicIssue | null = null;

      visibleIssues.forEach((issue) => {
        // Map latitude/longitude dummy coordinates to grid values between 0 and 4.9
        const issueGridX = (issue.location.lat % 5);
        const issueGridY = (issue.location.lng % 5);
        const floatOffset = Math.sin(time * 0.08 + issue.title.charCodeAt(0)) * 5;
        const pt = toIso(issueGridX, issueGridY, 35 + floatOffset);

        // Check mouse hover distance
        const isIHovered = Math.hypot(pt.x - mouseX, pt.y - mouseY) < 18;
        if (isIHovered) hoveredI = issue;

        const isISelected = selectedIssueId === issue.id;

        // Color coding for severity
        let markerColor = '#ef4444'; // critical/high
        if (issue.severity === 'medium') markerColor = '#eab308';
        if (issue.severity === 'low') markerColor = '#3b82f6';

        // Pulse ring
        const pulseRadius = 10 + (time * 1.2) % 18;
        const pulseAlpha = 1 - ((time * 1.2) % 18) / 18;
        ctx.strokeStyle = markerColor;
        ctx.globalAlpha = pulseAlpha;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(pt.x, pt.y + 12, pulseRadius, pulseRadius / 2, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1.0; // reset

        // Marker Base Anchor (Line to ground)
        ctx.strokeStyle = isWireframe ? 'rgba(255, 255, 255, 0.25)' : 'rgba(74, 85, 104, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y + 10);
        ctx.lineTo(pt.x, pt.y + 35 - floatOffset);
        ctx.stroke();

        // 3D holographic marker pin
        ctx.shadowBlur = isWireframe ? 12 : 4;
        ctx.shadowColor = markerColor;
        ctx.fillStyle = markerColor;
        
        ctx.beginPath();
        // Draw diamond shapes representing cybernetic pin
        ctx.moveTo(pt.x, pt.y - 4);
        ctx.lineTo(pt.x + 8, pt.y + 4);
        ctx.lineTo(pt.x, pt.y + 12);
        ctx.lineTo(pt.x - 8, pt.y + 4);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        // Miniature status indicator inside diamond
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y + 4, 2, 0, Math.PI * 2);
        ctx.fill();

        // Render hover/selected details on the canvas map directly if hovered
        if (isIHovered || isISelected) {
          ctx.fillStyle = isWireframe ? '#0f172a' : '#ffffff';
          ctx.strokeStyle = markerColor;
          ctx.lineWidth = 1.5;
          
          const labelY = pt.y - 25;
          const textWidth = ctx.measureText(issue.title).width + 24;

          // Label box
          ctx.beginPath();
          ctx.roundRect(pt.x - textWidth / 2, labelY - 14, textWidth, 24, 4);
          ctx.fill();
          ctx.stroke();

          // Severity mini tag
          ctx.fillStyle = markerColor;
          ctx.beginPath();
          ctx.arc(pt.x - textWidth / 2 + 10, labelY - 2, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = isWireframe ? '#f1f5f9' : '#1e293b';
          ctx.font = 'bold 10px sans-serif';
          ctx.fillText(issue.title, pt.x - textWidth / 2 + 20, labelY + 1);
        }
      });

      // 6. Draw floating 3D Automated Drone with scan lines
      const drawScanningDrones = () => {
        // Drone moves in large organic infinity loop over the city
        const droneAngle = time * 0.03;
        const dx = 2.5 + Math.sin(droneAngle * 2) * 1.8;
        const dy = 2.5 + Math.cos(droneAngle) * 1.8;
        
        // Flight altitude
        const droneZ = 120 + Math.sin(time * 0.1) * 8;
        const dronePt = toIso(dx, dy, droneZ);

        // Scan laser cone projecting to the ground
        ctx.globalAlpha = 0.15;
        const baseScanPt = toIso(dx, dy, 0);
        const scanGlow = ctx.createRadialGradient(baseScanPt.x, baseScanPt.y, 10, baseScanPt.x, baseScanPt.y, 40);
        scanGlow.addColorStop(0, scanningActive ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 240, 255, 0.4)');
        scanGlow.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = scanGlow;
        ctx.beginPath();
        ctx.moveTo(dronePt.x, dronePt.y);
        ctx.lineTo(baseScanPt.x - 35, baseScanPt.y + 10);
        ctx.lineTo(baseScanPt.x + 35, baseScanPt.y + 10);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Render scan target crosshair on ground
        ctx.strokeStyle = scanningActive ? '#ef4444' : '#00f0ff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(baseScanPt.x, baseScanPt.y + 5, 20 + Math.sin(time * 0.1) * 3, 10 + Math.sin(time * 0.1) * 1.5, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Scanning ring ticks
        ctx.beginPath();
        ctx.arc(baseScanPt.x, baseScanPt.y + 5, 2, 0, Math.PI * 2);
        ctx.fillStyle = scanningActive ? '#ef4444' : '#00f0ff';
        ctx.fill();

        // 3D Drone Body
        ctx.shadowBlur = 8;
        ctx.shadowColor = scanningActive ? '#ef4444' : '#00f0ff';
        ctx.fillStyle = isWireframe ? '#0f172a' : '#ffffff';
        ctx.strokeStyle = scanningActive ? '#ef4444' : '#00f0ff';
        ctx.lineWidth = 1.5;

        // Central capsule
        ctx.beginPath();
        ctx.roundRect(dronePt.x - 12, dronePt.y - 6, 24, 12, 6);
        ctx.fill();
        ctx.stroke();

        // Propeller Arms (4 motors)
        const armOffset = 16;
        const arms = [
          { x: -armOffset, y: -6 },
          { x: armOffset, y: -6 },
          { x: -armOffset, y: 6 },
          { x: armOffset, y: 6 }
        ];

        arms.forEach((arm) => {
          ctx.beginPath();
          ctx.moveTo(dronePt.x, dronePt.y);
          ctx.lineTo(dronePt.x + arm.x, dronePt.y + arm.y);
          ctx.stroke();

          // Small rotor node
          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.arc(dronePt.x + arm.x, dronePt.y + arm.y, 3, 0, Math.PI * 2);
          ctx.fill();

          // Rotating blade lines
          const bladeLength = 10;
          const bladeAngle = time * 0.8;
          ctx.strokeStyle = isWireframe ? 'rgba(255, 255, 255, 0.4)' : '#64748b';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(
            dronePt.x + arm.x - Math.cos(bladeAngle) * bladeLength,
            dronePt.y + arm.y - Math.sin(bladeAngle) * bladeLength / 2
          );
          ctx.lineTo(
            dronePt.x + arm.x + Math.cos(bladeAngle) * bladeLength,
            dronePt.y + arm.y + Math.sin(bladeAngle) * bladeLength / 2
          );
          ctx.stroke();
        });

        // Glowing pilot light
        ctx.fillStyle = scanningActive ? '#ef4444' : '#10b981';
        ctx.beginPath();
        ctx.arc(dronePt.x, dronePt.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      };
      drawScanningDrones();

      // Set React state based on what mouse is hovering over
      if (hoveredI) {
        if (hoveredEntity?.name !== (hoveredI as CivicIssue).title) {
          setHoveredEntity({ type: 'issue', name: (hoveredI as CivicIssue).title });
        }
      } else if (hoveredB) {
        if (hoveredEntity?.name !== (hoveredB as CityBuilding).name) {
          setHoveredEntity({ type: 'building', name: (hoveredB as CityBuilding).name });
        }
      } else {
        if (hoveredEntity !== null) setHoveredEntity(null);
      }

      animationId = requestAnimationFrame(drawLoop);
    };

    drawLoop();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleMouseClick);
    };
  }, [dimensions, activeIssues, isWireframe, selectedBuilding, selectedIssueId, scanningActive, simulationSpeed]);

  return (
    <div id="smart-city-stage" className="relative flex flex-col h-full w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0c]/70 backdrop-blur-xl">
      {/* City Status Banner */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-xs text-white/80 font-mono">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${cityAlertLevel === 'HIGH' ? 'bg-rose-400' : cityAlertLevel === 'MODERATE' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${cityAlertLevel === 'HIGH' ? 'bg-rose-500' : cityAlertLevel === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          </span>
          GRID ALERT: <span className="font-bold">{cityAlertLevel}</span>
        </div>

        <button 
          onClick={() => setIsWireframe(!isWireframe)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 hover:border-blue-500 hover:text-blue-400 transition-all text-xs text-white/80 font-mono cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5" />
          {isWireframe ? 'CYBER WIREFRAME' : 'SOLAR MODERN'}
        </button>

        <div className="flex items-center gap-1 bg-black/60 border border-white/10 rounded-full p-0.5">
          <button 
            onClick={() => setSimulationSpeed(0.5)}
            className={`px-2 py-0.5 text-[10px] font-mono rounded-full cursor-pointer transition-colors ${simulationSpeed === 0.5 ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white/70'}`}
          >
            0.5x
          </button>
          <button 
            onClick={() => setSimulationSpeed(1)}
            className={`px-2 py-0.5 text-[10px] font-mono rounded-full cursor-pointer transition-colors ${simulationSpeed === 1 ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white/70'}`}
          >
            1.0x
          </button>
          <button 
            onClick={() => setSimulationSpeed(2)}
            className={`px-2 py-0.5 text-[10px] font-mono rounded-full cursor-pointer transition-colors ${simulationSpeed === 2 ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white/70'}`}
          >
            2.0x
          </button>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-2">
        <div className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] text-blue-400 font-mono uppercase tracking-widest flex items-center gap-1">
          <Radio className="w-3 h-3 animate-pulse" /> Live Telemetry
        </div>
      </div>

      {/* Main Canvas Area */}
      <div ref={containerRef} className="flex-1 w-full min-h-[350px] relative">
        <canvas 
          ref={canvasRef} 
          width={dimensions.width} 
          height={dimensions.height}
          className="w-full h-full block cursor-crosshair"
        />

        {/* Hover Entity Toast overlay */}
        {hoveredEntity && (
          <div className="absolute bottom-4 left-4 bg-[#0a0a0c]/95 border border-blue-500/50 backdrop-blur px-3 py-1.5 rounded-lg shadow-xl pointer-events-none font-mono text-xs text-white max-w-xs transition-all">
            <div className="text-[10px] text-blue-400 uppercase tracking-wider flex items-center gap-1">
              {hoveredEntity.type === 'building' ? <Building2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              {hoveredEntity.type}
            </div>
            <div className="font-semibold truncate">{hoveredEntity.name}</div>
          </div>
        )}
      </div>

      {/* Telemetry diagnostics panel (appears on building click) */}
      <AnimatePresence>
        {selectedBuilding && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute bottom-4 right-4 left-4 sm:left-auto sm:w-[320px] bg-[#050505]/95 border border-white/10 backdrop-blur rounded-2xl p-4 shadow-2xl z-20"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-[10px] text-blue-400 font-mono uppercase tracking-widest block">District Monitor</span>
                <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  {selectedBuilding.name}
                </h4>
              </div>
              <button 
                onClick={() => setSelectedBuilding(null)}
                className="text-white/40 hover:text-white text-xs font-mono bg-white/[0.02] border border-white/10 rounded-xl px-2 py-1 cursor-pointer transition-colors"
              >
                ESC
              </button>
            </div>

            <p className="text-xs text-white/60 mb-3 leading-relaxed">
              {selectedBuilding.description}
            </p>

            <div className="space-y-2 border-t border-white/5 pt-3">
              {selectedBuilding.metrics.map((m, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-xl p-2 px-3">
                  <span className="text-[10px] text-white/40 font-mono">{m.label}</span>
                  <span className="text-xs font-mono font-bold text-white/80">{m.value}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                setScanningActive(true);
                setTimeout(() => setScanningActive(false), 1500);
              }}
              className="mt-4 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-mono text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/10"
            >
              <Eye className="w-3.5 h-3.5" /> TRIGGER AI SWEEP SCAN
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
