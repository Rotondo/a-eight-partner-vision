import { Partner } from '@/types/partner';

export type ChartContext = {
  g: d3.Selection<SVGGElement, unknown, null, undefined>;
  xScale: (value: number) => number;
  yScale: (value: number) => number;
  width: number;
  height: number;
};

export type ChartData = {
  partners: (Partner & { x: number; y: number })[];
};
