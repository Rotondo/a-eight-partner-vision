import { getChartConfig } from '@/lib/form-utils';

export const initChartCore = (svg: SVGSVGElement) => {
  const width = svg.clientWidth;
  const height = svg.clientHeight;
  
  return {
    ...getChartConfig(width, height),
    width,
    height
  };
};
