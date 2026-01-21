
import React from 'react';
import { TranscriptionResult } from '../types';

interface ResultViewProps {
  result: TranscriptionResult;
}

const ResultView: React.FC<ResultViewProps> = ({ result }) => {
  const copyToClipboard = (text: string, msg: string = 'Đã sao chép văn bản!') => {
    navigator.clipboard.writeText(text);
    alert(msg);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cột trái: Nội dung chính */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="p-2 bg-cyan-500/20 rounded-xl text-cyan-400">📝</span> 
                Transcript đầy đủ
              </h3>
              <button 
                onClick={() => copyToClipboard(result.fullText)}
                className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:scale-105 active:scale-95"
              >
                <span>Copy Toàn bộ</span>
              </button>
            </div>
            <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[600px] overflow-y-auto custom-scrollbar text-lg font-light">
              {result.fullText}
            </div>
          </div>

          {/* Phân đoạn thời gian */}
          {result.segments && result.segments.length > 0 && (
            <div className="glass rounded-3xl p-6 md:p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="p-2 bg-amber-500/20 rounded-xl text-amber-400">⏱️</span>
                Chi tiết theo mốc thời gian
              </h3>
              <div className="space-y-4">
                {result.segments.map((seg, idx) => (
                  <div 
                    key={idx} 
                    className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-slate-800 group"
                  >
                    <span className="text-amber-500 font-mono text-sm mt-1 shrink-0 bg-amber-500/10 px-3 py-1 rounded-lg h-fit">
                      {seg.start}
                    </span>
                    <div className="flex-1">
                      <p className="text-slate-300 group-hover:text-white transition-colors">
                        {seg.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cột phải: Thông tin tóm tắt */}
        <div className="space-y-8">
          <div className="glass rounded-3xl p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
            <h3 className="text-xl font-bold text-pink-400 mb-4 flex items-center gap-2">
              ✨ Tóm tắt AI
            </h3>
            <p className="text-slate-400 leading-relaxed italic text-sm md:text-base">
              "{result.summary}"
            </p>
          </div>

          <div className="glass rounded-3xl p-8 shadow-xl">
            <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
              🏷️ Hashtags & Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.keywords.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm rounded-xl hover:bg-purple-500/20 cursor-default transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 text-center">
            <p className="text-slate-500 text-xs mb-4 uppercase tracking-widest font-bold">Chia sẻ kết quả</p>
            <div className="flex justify-center gap-4">
               <button onClick={() => copyToClipboard(result.fullText)} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">📋</button>
               <button onClick={() => alert('Tính năng xuất PDF đang được phát triển!')} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">📄</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
