
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 text-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-pink-500/20 blur-[100px] rounded-full"></div>
      
      <div className="relative z-10 inline-block px-4 py-1 mb-4 text-xs font-semibold tracking-widest text-white uppercase tiktok-gradient rounded-full">
        Powered by Gemini 3 Flash
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
        TikTok <span className="text-transparent bg-clip-text tiktok-gradient">Transcriber</span> Pro
      </h1>
      <p className="text-slate-400 text-lg max-w-2xl mx-auto px-4">
        Chuyển đổi video TikTok thành văn bản tiếng Việt cực nhanh và chính xác. 
        Chỉ cần dán link video để bắt đầu.
      </p>
    </header>
  );
};

export default Header;
