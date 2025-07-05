'use client'
import { Button } from "@/components/ui/button"
import { FolderOpen, Sparkles, Cloud } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function Component() {
  const router = useRouter();
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let renderer: THREE.WebGLRenderer | null = null;
    let frameId: number;
    let globe: THREE.LineSegments | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;

    if (globeRef.current) {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, globeRef.current.offsetWidth / globeRef.current.offsetHeight, 0.1, 1000);
      camera.position.z = 2.5;
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(globeRef.current.offsetWidth, globeRef.current.offsetHeight);
      globeRef.current.appendChild(renderer.domElement);
      const geometry = new THREE.SphereGeometry(1.6, 32, 32);
      const wireframe = new THREE.WireframeGeometry(geometry);
      const material = new THREE.LineBasicMaterial({ color: 0x8f5fd7 }); // muted purple
      globe = new THREE.LineSegments(wireframe, material);
      scene.add(globe);
      const animate = () => {
        frameId = requestAnimationFrame(animate);
        if (globe) {
          // globe.rotation.y += 0.005;
          globe.rotation.y += 0.0015;
        }
        renderer!.render(scene!, camera!);
      };
      animate();
    }
    return () => {
      if (renderer && globeRef.current) {
        globeRef.current.removeChild(renderer.domElement);
      }
      if (frameId) cancelAnimationFrame(frameId);
      if (scene && globe) scene.remove(globe);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* 3D Globe Background */}
      <div ref={globeRef} className="absolute inset-0 z-0" style={{ width: '100vw', height: '100vh', pointerEvents: 'none', overflow: 'hidden' }} />
      {/* Animated gradient blobs background */}
      <div className="absolute inset-0 z-0" style={{ overflow: 'hidden' }}>
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-700/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-green-500/20 rounded-full blur-3xl animate-pulse-slower" />
        <div className="absolute top-1/2 left-1/2 w-[60vw] h-[60vw] bg-blue-500/10 rounded-full blur-2xl animate-pulse" style={{ transform: 'translate(-50%, -50%)' }} />
      </div>
      {/* Dark overlay */}
      <div className="absolute inset-0 z-10 bg-black/50 pointer-events-none" style={{ overflow: 'hidden' }} />
      {/* Main content */}
      <div className="relative z-20 text-center space-y-8 max-w-md w-full" style={{ overflow: 'hidden' }}>
        {/* Floating icons */}
        <div className="relative">
          <div className="absolute -top-8 -left-8 animate-bounce delay-100">
            <FolderOpen className="w-6 h-6 text-blue-400/60" />
          </div>
          <div className="absolute -top-4 -right-6 animate-bounce delay-300">
            <Cloud className="w-5 h-5 text-green-400/60" />
          </div>
          <div className="absolute -bottom-2 left-4 animate-bounce delay-500">
            <Sparkles className="w-4 h-4 text-purple-400/60" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            Google Drive
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 animate-pulse">
              Assistant
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          Your intelligent companion for managing and analyzing your Google Drive files
        </p>

        {/* Sign in button */}
        <div className="space-y-4 overflow-visible">
          <div className="relative flex justify-center overflow-visible">
            <Button
              onClick={async () => {
                try {
                  const response = await fetch('http://localhost:3001/authenticate');
                  if (response.ok) {
                    const data = await response.json();
                    // Optionally store data if needed
                    router.push('/chat');
                  } else {
                    const errorText = await response.text();
                    console.error('Authentication failed:', errorText);
                  }
                } catch (err) {
                  console.error('Request error:', err);
                }
              }}
              size="lg"
              className="bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-8 rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-300 group scale-100 hover:scale-110 focus:scale-110 active:scale-105"
              style={{ minWidth: '60%', maxWidth: '100%' }}
            >
              <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4">Secure authentication powered by Google OAuth</p>
        </div>

        {/* Feature hints */}
        <div className="flex justify-center gap-4 mt-12 pt-8 border-t border-gray-700/50">
          <div className="text-center">
            <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-xs text-gray-400">AI-Powered</p>
          </div>
          <div className="text-center">
            <Cloud className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-xs text-gray-400">Cloud Sync</p>
          </div>
        </div>
      </div>
    </div>
  )
}
