
import { GoogleGenAI, Type } from "@google/genai";

// Hàm khởi tạo AI instance một cách an toàn
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Ứng dụng chưa được cấu hình API Key. Vui lòng kiểm tra Environment Variables trên Vercel.");
  }
  return new GoogleGenAI({ apiKey });
};

export async function transcribeMedia(fileBase64: string, mimeType: string) {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `Bạn là một chuyên gia chuyển soạn (transcriptionist) chuyên nghiệp nhất Việt Nam.
Nhiệm vụ: Chuyển đổi âm thanh/video TikTok thành văn bản tiếng Việt chính xác 100%.

Yêu cầu chi tiết:
1. Transcription: Ghi lại từng từ một cách trung thực, bao gồm cả từ lóng, thán từ và các thuật ngữ trending trên TikTok.
2. Dấu câu: Ngắt câu hợp lý, sử dụng đúng dấu câu để bản văn dễ đọc.
3. Phân biệt người nói: Nếu video có nhiều người nói, hãy ghi chú [Người 1], [Người 2] ở đầu dòng.
4. Tóm tắt: Viết một đoạn tóm tắt ngắn nhưng đầy đủ ý chính của video.
5. Từ khóa: Trích xuất 5-7 từ khóa quan trọng nhất.

Định dạng đầu ra PHẢI là JSON theo schema được cung cấp.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: fileBase64,
              mimeType: mimeType,
            },
          },
          {
            text: "Hãy nghe và xem video này, sau đó transcript sang tiếng Việt một cách chi tiết nhất."
          }
        ],
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullText: { type: Type.STRING },
            summary: { type: Type.STRING },
            keywords: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }
            },
            segments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  start: { type: Type.STRING },
                  text: { type: Type.STRING }
                }
              }
            }
          },
          required: ["fullText", "summary", "keywords", "segments"]
        }
      }
    });

    if (!response.text) {
      throw new Error("AI không trả về nội dung.");
    }

    return JSON.parse(response.text);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes('403') || error.message?.includes('API key not found')) {
      throw new Error("Lỗi xác thực API. Hãy đảm bảo bạn đã thêm API_KEY vào Environment Variables của Vercel dự án này.");
    }
    throw error;
  }
}
