import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ghost, ShieldAlert, Sparkles, Trophy } from 'lucide-react';

const TAUNTS = [
  "千万不要点我",
  "哎呀，没点着！",
  "太慢了！",
  "就这？",
  "放弃吧，你点不到的",
  "手速不太行啊",
  "我都快睡着了",
  "不如去喝杯水再来",
  "差一点点哦",
  "我的奶奶都比你快",
];

export default function App() {
  const [dodges, setDodges] = useState(0);
  const [clicked, setClicked] = useState(false);
  
  // Start exactly in the center
  const [position, setPosition] = useState({ 
    top: '50%', 
    left: '50%', 
  });

  const getTaunt = (count: number) => {
    if (count < TAUNTS.length) return TAUNTS[count];
    return TAUNTS[Math.floor(Math.random() * (TAUNTS.length - 2)) + 2];
  };

  const moveButton = () => {
    if (clicked) return;

    // Use percentage coordinates to stay within screen naturally
    // Keep it between 10% and 90% to avoid edges
    const randomX = Math.floor(Math.random() * 80) + 10;
    const randomY = Math.floor(Math.random() * 80) + 10;

    setPosition({ 
      top: `${randomY}%`, 
      left: `${randomX}%`,
    });
    
    setDodges(prev => prev + 1);
  };

  const handleWin = () => {
    setClicked(true);
  };

  const resetGame = () => {
    setDodges(0);
    setClicked(false);
    setPosition({ top: '50%', left: '50%' });
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 text-slate-50 overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Background ambient text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center pointer-events-none opacity-[0.03] whitespace-nowrap">
        <span className="text-[20vw] font-black tracking-tighter">
          {dodges === 0 ? "DON'T" : "CATCH!"}
        </span>
      </div>

      <div className="absolute top-8 left-0 right-0 flex justify-center pointer-events-none opacity-50 text-slate-400 text-sm tracking-widest uppercase">
        {dodges > 0 && !clicked && `Missed: ${dodges}`}
      </div>

      <AnimatePresence mode="wait">
        {!clicked ? (
          <motion.div
            key="catch-button-container"
            className="absolute"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              top: position.top, 
              left: position.left,
              opacity: 1,
              scale: 1
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 20,
              mass: 0.8
            }}
            style={{
              x: '-50%',
              y: '-50%',
            }}
          >
            <motion.button
              className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-lg shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition-colors whitespace-nowrap"
              onMouseEnter={moveButton}
              onClick={(e) => {
                // In case they click before mouseEnter triggers (e.g. touch or fast click)
                if (dodges === 0) moveButton(); 
                else handleWin();
              }}
              whileTap={{ scale: 0.9 }}
            >
              {dodges === 0 ? <ShieldAlert size={20} /> : <Ghost size={20} />}
              {getTaunt(dodges)}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="win-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-10 p-6 text-center backdrop-blur-md"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="bg-slate-900 border border-slate-800 p-10 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500" />
              
              <div className="flex justify-center mb-6 text-yellow-400">
                <Trophy size={64} className="drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]" />
              </div>
              
              <h1 className="text-3xl font-extrabold mb-3 tracking-tight text-white">难以置信！</h1>
              <p className="text-slate-400 mb-8 leading-relaxed">
                你居然真的点到了！<br/>
                这需要极快的手速或者<span className="text-slate-300">一点小聪明</span>。<br/>
                总共被戏弄了 <span className="font-bold text-indigo-400 text-xl mx-1">{dodges}</span> 次。
              </p>

              <button 
                onClick={resetGame}
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-white hover:bg-slate-200 text-slate-900 rounded-xl font-bold transition-colors shadow-lg active:scale-95"
              >
                <Sparkles size={20} />
                再玩一次 (Play Again)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-auto">
        <a 
          href="https://beian.miit.gov.cn/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-slate-500 hover:text-slate-300 text-xs transition-colors shrink-0"
        >
          浙ICP备2025170013号-3
        </a>
      </div>
    </div>
  );
}
