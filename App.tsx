
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import LinkInput from './components/LinkInput';
import ResultView from './components/ResultView';
import { TranscriptionResult, ProcessState } from './types';
import { transcribeMedia } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<ProcessState>(ProcessState.IDLE);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLinkSubmit = useCallback(async (url: string) => {
    setState(ProcessState.LOADING);
    setLoadingStep('Bắt đầu phân tích link TikTok...');
    setError(null);
    
    try {
      // 1. Lấy thông tin video từ TikWM API
      const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
      const tiktokResponse = await fetch(apiUrl);
      
      if (!tiktokResponse.ok) throw new Error("Máy chủ trích xuất video đang bận. Vui lòng thử lại sau.");
      
      const tiktokData = await tiktokResponse.json();

      if (!tiktokData.data || !tiktokData.data.play) {
        throw new Error("Không tìm thấy video. Link có thể bị sai, video đã bị xóa hoặc được để ở chế độ riêng tư.");
      }

      // 2. Tải video blob
      setLoadingStep('Đang tải dữ liệu video (Dung lượng lớn có thể mất chút thời gian)...');
      const videoUrl = tiktokData.data.play;
      const mediaResponse = await fetch(videoUrl);
      
      if (!mediaResponse.ok) throw new Error("Không thể tải dữ liệu từ TikTok CDN.");
      
      const blob = await mediaResponse.blob();
      
      // Giới hạn 100MB cho sự ổn định của trình duyệt
      if (blob.size > 100 * 1024 * 1024) {
        throw new Error("Video vượt quá giới hạn 100MB. Hãy chọn video có dung lượng thấp hơn.");
      }

      // 3. Chuyển sang Base64
      setLoadingStep('Đang mã hóa video cho AI...');
      const base64 = await blobToBase64(blob);
      
      // 4. Gọi AI Gemini
      setLoadingStep('Gemini 3 đang nghe và trích xuất tiếng Việt (Sắp xong rồi!)...');
      const data = await transcribeMedia(base64, blob.type);
      
      setResult(data);
      setState(ProcessState.SUCCESS);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã xảy ra lỗi trong quá trình xử lý.");
      setState(ProcessState.ERROR);
    }
  }, []);

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) resolve(base64String);
        else reject(new Error("Mã hóa video thất bại."));
      };
      reader.onerror = () => reject(new Error("Lỗi khi đọc file video."));
    });
  };

  const reset = () => {
    setState(ProcessState.IDLE);
    setResult(null);
    setError(null);
    setLoadingStep('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] selection:bg-cyan-500/30">
      <Header />
      
      <main className="container mx-auto px-4">
        {state === ProcessState.IDLE && (
          <div className="animate-in fade-in zoom-in duration-500">
            <LinkInput onLinkSubmit={handleLinkSubmit} isLoading={false} />
          </div>
        )}

        {state === ProcessState.LOADING && (
          <div className="flex flex-col items-center justify-center py-32 px-4">
            <div className="relative w-32 h-32 mb-10">
              <div className="absolute inset-0 border-[6px] border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-[6px] border-t-cyan-400 border-r-pink-400 rounded-full animate-spin"></div>
              <div className="absolute inset-4 bg-slate-900 rounded-full flex items-center justify-center text-3xl">
                🤖
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent tiktok-gradient animate-pulse">
              Đang làm việc...
            </h2>
            <p className="text-slate-400 text-center max-w-md text-lg font-light leading-relaxed">
              {loadingStep}
            </p>
          </div>
        )}

        {state === ProcessState.ERROR && (
          <div className="max-w-xl mx-auto px-4 py-16 animate-in slide-in-from-top-4 duration-500">
            <div className="glass border-red-500/20 rounded-[2rem] p-10 text-center shadow-2xl shadow-red-500/5">
              <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">
                ⚠️
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Rất tiếc, đã có lỗi!</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">{error}</p>
              <button 
                onClick={reset}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white font-bold transition-all border border-slate-700 hover:border-slate-500"
              >
                Thử lại với link khác
              </button>
            </div>
          </div>
        )}

        {state === ProcessState.SUCCESS && result && (
          <div className="space-y-6">
            <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                <span className="text-green-400 font-bold text-sm uppercase tracking-wider">Xử lý thành công</span>
              </div>
              <button 
                onClick={reset}
                className="text-slate-400 hover:text-white text-sm font-medium flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl transition-colors"
              >
                🔄 Transcript link khác
              </button>
            </div>
            <ResultView result={result} />
          </div>
        )}
      </main>

      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-900/50 mt-12 mb-20">
        <p className="mb-2">Công cụ được phát triển bởi <span className="text-slate-300 font-bold">Tùng Tinh Tấn</span></p>
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-50">Dành riêng cho cộng đồng người dùng Việt Nam</p>
      </footer>
    </div>
  );
};

export default App;
