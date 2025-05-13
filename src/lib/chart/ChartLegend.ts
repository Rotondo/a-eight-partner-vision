
import * as d3 from 'd3';
import { sizeColorMap } from '@/types/partner';
import { ChartContext } from './types';

export const drawLegend = ({ g, xScale, yScale }: ChartContext) => {
  const legend = g.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${xScale(0)}, ${yScale(5)})`);

  Object.entries(sizeColorMap).forEach(([size, color], i) => {
    legend.append('circle')
      .attr('cx', i * 60)
      .attr('cy', 0)
      .attr('r', 7)
      .attr('fill', size === 'GG' ? '#FF46A2' : color);

    legend.append('text')
      .attr('x', i * 60 + 15)
      .attr('y', 5)
      .attr('font-size', '0.8rem')
      .attr('fill', '#64748b')
      .text(size);
  });
};
