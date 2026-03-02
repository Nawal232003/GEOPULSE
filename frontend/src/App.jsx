import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Globe from './components/Globe';
import NewsTicker from './components/NewsTicker';
import { useSocket } from './contexts/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { articles, isConnected } = useSocket();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isHoveringGlobe, setIsHoveringGlobe] = useState(false);

  return (
    <div className="w-screen h-screen bg-[#0a0a0a] relative overflow-hidden flex">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <color attach="background" args={['#0a0a0a']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />

          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

          <Globe
            articles={articles}
            onSelectArticle={setSelectedArticle}
            setHovering={setIsHoveringGlobe}
          />

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2.5}
            maxDistance={8}
            autoRotate={isHoveringGlobe} // Rotate when hovered
            autoRotateSpeed={0.8}
          />

          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex justify-between p-6">
        {/* Left Side: Title and Ticker */}
        <div className="flex flex-col">
          <header className="glass-panel p-4 rounded-xl mb-4 pointer-events-auto shadow-2xl border-l-4 border-l-[#FFD700]">
            <h1 className="text-3xl font-extrabold tracking-wider text-white">GEO<span className="text-[#FFD700]">PULSE</span></h1>
            <p className="text-gray-400 text-sm mt-1">Real-Time Global Intelligence Directory</p>
            <div className="flex items-center mt-3 text-xs font-semibold uppercase tracking-widest gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse box-shadow-green' : 'bg-red-500'}`}></span>
              {isConnected ? 'System Online' : 'Connecting...'}
            </div>
          </header>

          <NewsTicker articles={articles} onSelectArticle={setSelectedArticle} />
        </div>

        {/* Right Side: Selected Article Detail */}
        <AnimatePresence>
          {selectedArticle && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="glass-panel w-96 h-fit max-h-[80vh] overflow-y-auto p-6 rounded-xl shadow-2xl pointer-events-auto border-t-4 border-t-[#FFD700] relative mt-20"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
              <div className="text-xs text-[#FFD700] mb-2 uppercase font-bold tracking-wider">
                {selectedArticle.location?.country || 'Global Report'}
              </div>
              <h2 className="text-xl font-bold text-white mb-4 leading-tight">
                {selectedArticle.title}
              </h2>
              <div className="text-sm text-gray-300 mb-6 leading-relaxed">
                {selectedArticle.content || 'Content analysis unavailable.'}
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 border-t border-white/10 pt-4">
                <span className="font-semibold text-gray-400">Source: {selectedArticle.source}</span>
                <a
                  href={selectedArticle.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#FFD700] hover:text-white transition flex items-center gap-1 font-bold"
                >
                  Full Report ↗
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
