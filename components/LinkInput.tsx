
import React, { useState } from 'react';

interface LinkInputProps {
  onLinkSubmit: (url: string) => void;
  isLoading: boolean;
}

const LinkInput: React.FC<LinkInputProps> = ({ onLinkSubmit, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && url.includes('tiktok.com')) {
      onLinkSubmit(url.trim());
    } else {
      alert('Vui lòng nhập một đường link TikTok hợp lệ.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 mb-12">
      <div className="glass rounded-3xl p-8 md:p-12 text-center transition-all duration-300">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 mb-6 rounded-full bg-slate-800 flex items-center justify-center text-4xl float shadow-lg shadow-cyan-500/20">
            🔗
          </div>
          <h3 className="text-2xl font-bold mb-2">Dán link TikTok vào đây</h3>
          <p className="text-slate-400 mb-8 max-w-sm">
            Hệ thống sẽ tự động tải video và chuyển đổi thành văn bản tiếng Việt chính xác.
          </p>
          
          <form onSubmit={handleSubmit} className="w-full flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@username/video/..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !url}
              className={`px-8 py-4 rounded-2xl font-bold text-white tiktok-gradient hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-pink-500/20 disabled:opacity-50 disabled:scale-100 whitespace-nowrap`}
            >
              {isLoading ? 'Đang xử lý...' : 'Bắt đầu Transcript'}
            </button>
          </form>
          
          <div className="mt-8 flex items-center justify-center gap-6 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span> Auto Detection</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-pink-400 rounded-full"></span> Vietnamese AI</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full"></span> High Accuracy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkInput;
