import { GoogleGenAI } from "@google/genai";
import type { LicenseResult } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey });

const cleanJson = (text: string): string => {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    return match ? match[1].trim() : text.trim();
};


export const checkSoftwareLicense = async (softwareName: string): Promise<LicenseResult> => {
    const prompt = `
    당신은 소프트웨어 라이선스 전문 분석가입니다. Google 검색을 사용하여 '${softwareName}'라는 소프트웨어의 라이선스 정책을 조사해주세요.

    개인 사용자와 기업 사용자 각각에 대한 라이선스 유형을 확인해야 합니다.

    라이선스 유형은 다음 중 하나여야 합니다: '상용', '쉐어웨어', '프리웨어', '확인 불가'.

    다음 JSON 형식에 맞춰서 답변해주세요. 다른 설명 없이 JSON 객체만 반환해야 합니다.

    \`\`\`json
    {
      "personal": {
        "type": "...",
        "reasoning": "개인 사용자에 대한 라이선스 정책과 그 근거를 간략히 설명합니다."
      },
      "enterprise": {
        "type": "...",
        "reasoning": "기업 사용자에 대한 라이선스 정책과 그 근거를 간략히 설명합니다."
      }
    }
    \`\`\`
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
        const sources = groundingMetadata?.groundingChunks
            ?.map(chunk => chunk.web)
            .filter((web): web is { uri: string; title: string } => !!web?.uri && !!web.title)
            // Remove duplicate sources by URI
            .reduce((acc, current) => {
                if (!acc.find(item => item.uri === current.uri)) {
                    acc.push(current);
                }
                return acc;
            }, [] as { uri: string; title: string }[]) || [];
        
        const jsonText = cleanJson(response.text);
        const licenseData = JSON.parse(jsonText);
        
        return { ...licenseData, sources };

    } catch (error) {
        console.error("Error calling Gemini API or parsing response:", error);
        throw new Error("라이선스 확인에 실패했습니다. API가 오류를 반환했거나 응답 형식이 올바르지 않습니다.");
    }
};