
import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 mb-12">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative glass rounded-3xl p-12 text-center border-2 border-dashed transition-all duration-300 ${
          isDragging ? 'border-cyan-400 bg-cyan-400/10' : 'border-slate-700 hover:border-slate-500'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleChange}
          accept="video/*,audio/*"
          className="hidden"
        />
        
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 mb-6 rounded-2xl bg-slate-800 flex items-center justify-center text-4xl float">
            🎬
          </div>
          <h3 className="text-2xl font-bold mb-2">Tải video TikTok lên</h3>
          <p className="text-slate-400 mb-8 max-w-xs">
            Kéo thả video vào đây hoặc nhấn để chọn tệp từ thiết bị của bạn.
          </p>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-3 rounded-full font-bold text-white tiktok-gradient hover:scale-105 active:scale-95 transition-transform"
          >
            Chọn Video / Audio
          </button>
          
          <div className="mt-8 flex items-center justify-center gap-4 text-xs text-slate-500 uppercase font-medium">
            <span>Video (MP4, MOV)</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
            <span>Audio (MP3, WAV)</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
            <span>Max 100MB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
