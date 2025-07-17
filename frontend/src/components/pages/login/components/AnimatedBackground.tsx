import React, { useRef, useEffect } from 'react';
import Renderer from '../services/webgl';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  
  // Initialize WebGL shader animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.max(1, window.devicePixelRatio);
    
    const resize = () => {
      const { innerWidth: width, innerHeight: height } = window;
      // Canvas only covers left half
      canvas.width = (width / 2) * dpr;
      canvas.height = height * dpr;
      canvas.style.width = (width / 2) + 'px';
      canvas.style.height = height + 'px';
      if (rendererRef.current) {
        rendererRef.current.updateScale(dpr);
      }
    };

    try {
      rendererRef.current = new Renderer(canvas, dpr);
      rendererRef.current.setup();
      rendererRef.current.init();
      resize();

      const loop = (now: number) => {
        if (rendererRef.current) {
          rendererRef.current.render(now);
        }
        animationFrameRef.current = requestAnimationFrame(loop);
      };
      loop(0);

      const handleResize = () => resize();
      window.addEventListener('resize', handleResize);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (rendererRef.current) {
          rendererRef.current.cleanup();
        }
        window.removeEventListener('resize', handleResize);
      };
    } catch (error) {
      console.error('WebGL initialization failed:', error);
    }
  }, []);

  return (
    <div className="relative w-1/2">
      {/* WebGL Canvas Animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-white">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-white rounded-full"></div>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Brand Info */}
        <div className="text-center max-w-md">
          <h1 className="text-5xl font-bold mb-4">CollabEvent</h1>
          <p className="text-xl opacity-90 mb-6">Event Management Software</p>
        </div>
      </div>
    </div>
  );
};

export default AnimatedBackground;