
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function transcribeMedia(fileBase64: string, mimeType: string) {
  // Sử dụng gemini-3-flash-preview để có tốc độ và khả năng xử lý media tốt nhất
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `Bạn là một chuyên gia chuyển soạn (transcriptionist) chuyên nghiệp nhất Việt Nam.
Nhiệm vụ: Chuyển đổi âm thanh/video TikTok thành văn bản tiếng Việt chính xác 100%.

Yêu cầu chi tiết:
1. Transcription: Ghi lại từng từ một cách trung thực, bao gồm cả từ lóng, thán từ (như "à", "ừm", "hả") và các thuật ngữ trending trên TikTok.
2. Dấu câu: Ngắt câu hợp lý, sử dụng đúng dấu câu để bản văn dễ đọc.
3. Phân biệt người nói: Nếu video có nhiều người nói, hãy ghi chú [Người 1], [Người 2] ở đầu dòng.
4. Tóm tắt: Viết một đoạn tóm tắt ngắn nhưng đầy đủ ý chính của video.
5. Từ khóa: Trích xuất 5-7 từ khóa quan trọng nhất để làm hashtag.

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
            text: "Hãy nghe và xem video này, sau đó transcript sang tiếng Việt một cách chi tiết nhất. Tập trung vào tính chính xác của ngôn từ."
          }
        ],
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullText: { type: Type.STRING, description: "Bản ghi âm đầy đủ, không bỏ sót từ nào." },
            summary: { type: Type.STRING, description: "Tóm tắt nội dung video dưới 100 chữ." },
            keywords: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Danh sách các từ khóa chính."
            },
            segments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  start: { type: Type.STRING, description: "Thời gian bắt đầu đoạn (ví dụ: 0:05)." },
                  text: { type: Type.STRING, description: "Nội dung văn bản trong đoạn đó." }
                }
              },
              description: "Chia nhỏ video thành các đoạn dựa trên thời gian."
            }
          },
          required: ["fullText", "summary", "keywords", "segments"]
        }
      }
    });

    if (!response.text) {
      throw new Error("AI không thể trích xuất được nội dung từ video này. Có thể video không có tiếng hoặc định dạng không hỗ trợ.");
    }

    return JSON.parse(response.text);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes('403')) throw new Error("Lỗi API Key. Vui lòng kiểm tra lại cấu hình trên Vercel.");
    throw error;
  }
}
