export const READINESS_WEIGHTS={mocks:.4,skills:.2,coverage:.15,mistakes:.1,time:.1,consistency:.05};
export interface ReadinessInputs { approvedFullMocks:number; objectiveAnswers:number; mocks:number|null;skills:number|null;coverage:number;mistakes:number|null;time:number|null;consistency:number }
export function calculateReadiness(input:ReadinessInputs):{score:number|null;reason:string;components:{key:string;value:number|null;weight:number}[]}{
  const components=Object.entries(READINESS_WEIGHTS).map(([key,weight])=>({key,weight,value:input[key as keyof typeof READINESS_WEIGHTS]}));
  if(input.approvedFullMocks<2||input.objectiveAnswers<30||components.some(c=>c.value===null))return{score:null,reason:'Cần ít nhất 2 đề đầy đủ đã duyệt và 30 câu khách quan để ước lượng mức sẵn sàng. Lượt luyện ngắn chưa đủ bằng chứng.',components};
  const score=Math.round(components.reduce((sum,c)=>sum+Math.max(0,Math.min(100,c.value!))*c.weight,0));return{score,reason:'Ước lượng từ dữ liệu học của bạn, không phải điểm hoặc chứng nhận HSK.',components};
}
