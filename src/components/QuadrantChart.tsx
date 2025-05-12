import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Partner } from '@/types/partner';
import { initChartCore } from '@/lib/chart/ChartCore';
import { drawLegend } from '@/lib/chart/ChartLegend';
// Importe outros serviços conforme criar

const QuadrantChart: React.FC<{ partners: Partner[] }> = ({ partners }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Inicialização do núcleo
    const { g, xScale, yScale } = initChartCore(svgRef.current);
    
    // Chamada aos microsserviços
    drawLegend({ g, xScale, yScale, width: 0, height: 0 }); // Ajuste dimensões
    
  }, [partners]);

  return <svg ref={svgRef} className="w-full h-full" />;
};

export default QuadrantChart;
