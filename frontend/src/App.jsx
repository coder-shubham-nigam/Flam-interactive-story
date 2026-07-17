import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Loader2, Sparkles } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [storyData, setStoryData] = useState(null);
  const [activeHotspot, setActiveHotspot] = useState(null);

  const generateStory = async (e) => {
    e.preventDefault();
    if (!theme) return;
    
    setLoading(true);
    setStoryData(null);
    setActiveHotspot(null);
    
    try {
      const res = await axios.post('http://localhost:5000/api/generate-story', { theme });
      const data = res.data;
      
      const imageUrl = data.imageSearchTerm 
        ? `https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1280&auto=format&fit=crop` 
        : `https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1280&auto=format&fit=crop`;

      setStoryData({ ...data, imageUrl });
    } catch (error) {
      console.error(error);
      alert("Error: Make sure backend is running on port 5000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full mx-auto mb-8 text-center mt-8">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-2">
          <Sparkles className="text-indigo-400" /> Flam: AI Canvas
        </h1>
        
        <form onSubmit={generateStory} className="flex gap-3 max-w-lg mx-auto bg-gray-900 p-2 rounded-xl border border-gray-800">
          <input 
            type="text" 
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="e.g., Cyberpunk city..." 
            className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create'}
          </button>
        </form>
      </div>

      <div className="max-w-4xl w-full mx-auto">
        {storyData && (
          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-100">{storyData.storyTitle}</h2>
            </div>

            <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
              <img 
                src={storyData.imageUrl} 
                alt="Scene" 
                className="w-full h-full object-cover opacity-75"
              />

              {storyData.hotspots.map((spot) => (
                <div 
                  key={spot.id}
                  className="absolute"
                  style={{ top: `${spot.y}%`, left: `${spot.x}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <motion.button
                    onClick={() => setActiveHotspot(spot)}
                    className="relative flex items-center justify-center w-9 h-9 rounded-full bg-indigo-500 text-white z-10 cursor-pointer"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <MessageCircle size={18} />
                    <span className="absolute w-full h-full rounded-full bg-indigo-500 opacity-40 animate-ping"></span>
                  </motion.button>
                </div>
              ))}

              <AnimatePresence>
                {activeHotspot && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-4 left-4 right-4 bg-gray-900/90 backdrop-blur-md border border-gray-800 p-5 rounded-xl z-20"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-indigo-400">{activeHotspot.title}</h3>
                      <button onClick={() => setActiveHotspot(null)} className="text-gray-400 hover:text-white cursor-pointer">
                        <X size={18} />
                      </button>
                    </div>
                    <p className="text-gray-300 text-sm">{activeHotspot.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}