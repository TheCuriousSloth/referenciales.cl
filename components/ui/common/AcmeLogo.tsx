"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/lib/styles/fonts';
import throttle from 'lodash/throttle';

export default function AcmeLogo() {
  const [rotationAngle, setRotationAngle] = useState(0);
  const logoContainerRef = useRef<HTMLDivElement>(null);

  const calculateAngle = (event: MouseEvent) => {
    if (!logoContainerRef.current) return;

    const rect = logoContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const dy = mouseY - centerY;
    const dx = mouseX - centerX;
    const angleRad = Math.atan2(dy, dx);
    let angleDeg = angleRad * (180 / Math.PI);
    
    // Ajustar offset para que 0 grados apunte hacia arriba
    angleDeg += 90;

    setRotationAngle(angleDeg);
  };

  const handleMouseMove = useCallback(
    throttle((event: MouseEvent) => calculateAngle(event), 50),
    []
  );

  useEffect(() => {
    const element = logoContainerRef.current;
    if (!element) return;

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', () => setRotationAngle(0));

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', () => setRotationAngle(0));
      handleMouseMove.cancel(); // Limpiar el throttle al desmontar
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={logoContainerRef}
      className={`
        ${lusitana.className} 
        flex flex-col items-center justify-center 
        min-h-[6rem]
        mt-4 md:mt-0
        gap-2
      `}
    >
      <GlobeAltIcon 
        className="h-6 w-6 md:h-10 md:w-10 text-white transform transition-transform duration-300 ease-in-out"
        style={{ transform: `rotate(${rotationAngle}deg)` }}
      />
      <p className="text-sm md:text-lg font-semibold tracking-tight text-white text-center leading-tight">
        referenciales
        <span className="text-white">.cl</span>
      </p>
    </div>
  );
}