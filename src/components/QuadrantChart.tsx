// src/components/QuadrantChart.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Partner, sizeColorMap } from '@/types/partner';
import { getChartConfig, calculateChartPosition } from '@/lib/form-utils';

interface QuadrantChartProps {
  partners: Partner[];
  onSelectPartner: (partner: Partner) => void;
}

const QuadrantChart: React.FC<QuadrantChartProps> = ({ partners, onSelectPartner }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || partners.length === 0) return;

    // Configurações do gráfico
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const { 
      margin, 
      innerWidth, 
      innerHeight, 
      xScale, 
      yScale, 
      quadrantLines, 
      quadrantLabels 
    } = getChartConfig(width, height);

    // Limpa o SVG antes de redesenhar
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Cria grupo principal
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // 1. Desenha linhas do quadrante
    quadrantLines.forEach(line => {
      g.append('line')
        .attr('x1', line.x1)
        .attr('y1', line.y1)
        .attr('x2', line.x2)
        .attr('y2', line.y2)
        .attr('stroke', '#94a3b8')
        .attr('stroke-dasharray', '4 2');
    });

    // 2. Adiciona rótulos dos quadrantes
    quadrantLabels.forEach(label => {
      g.append('text')
        .attr('x', label.x)
        .attr('y', label.y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#64748b')
        .attr('font-size', '0.75rem')
        .text(label.text);
    });

    // 3. Legenda de cores
    const legendData = [
      { label: 'PP', color: sizeColorMap['PP'] },
      { label: 'P', color: sizeColorMap['P'] },
      { label: 'M', color: sizeColorMap['M'] },
      { label: 'G', color: sizeColorMap['G'] },
      { label: 'GG', color: '#FF46A2'['GG'] }
    ];

    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${margin.left}, ${margin.top / 2})`);

    legendData.forEach((item, i) => {
      legend.append('circle')
        .attr('cx', i * 60)
        .attr('cy', 0)
        .attr('r', 7)
        .attr('fill', item.color);

      legend.append('text')
        .attr('x', i * 60 + 15)
        .attr('y', 5)
        .attr('font-size', '0.8rem')
        .attr('fill', '#64748b')
        .text(item.label);
    });

    // 4. Configuração do tooltip
    const tooltip = d3.select(tooltipRef.current)
      .attr('class', 'absolute bg-white p-2 rounded shadow-md text-sm z-10 pointer-events-none')
      .style('display', 'none');

    // 5. Calcula posições dos parceiros
    const partnersWithPositions = partners.map(partner => ({
      ...partner,
      ...calculateChartPosition(partner)
    }));

    // 6. Desenha pontos dos parceiros
    const points = g.selectAll('.partner-point')
      .data(partnersWithPositions)
      .enter()
      .append('circle')
      .attr('class', 'partner-point')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 5)
      .attr('fill', d => sizeColorMap[d.size])
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .on('click', (_, d) => onSelectPartner(d));

    // 7. Preparar dados para os rótulos com offsets
    const labelPadding = 10;
    const labelData = partnersWithPositions.map(d => ({
      ...d,
      labelX: xScale(d.x) + labelPadding,
      labelY: yScale(d.y) - labelPadding,
      width: d.name.length * 5.5, // Estimativa de largura baseada no comprimento do texto
      height: 16 // Altura estimada do texto
    }));

    // 8. Detectar sobreposições
    const overlapping = new Set();
    
    // Compara cada par de rótulos para detectar sobreposição
    for (let i = 0; i < labelData.length; i++) {
      const a = labelData[i];
      for (let j = i + 1; j < labelData.length; j++) {
        const b = labelData[j];
        
        // Verificar se os retângulos dos rótulos se sobrepõem
        if (a.labelX < b.labelX + b.width &&
            a.labelX + a.width > b.labelX &&
            a.labelY < b.labelY + b.height &&
            a.labelY + a.height > b.labelY) {
          // Ambos os rótulos estão sobrepostos
          overlapping.add(i);
          overlapping.add(j);
        }
      }
    }

    // 9. Criar grupo para os rótulos fixos (que não se sobrepõem)
    const fixedLabels = g.append('g').attr('class', 'fixed-labels');
    
    // 10. Criar grupo para os rótulos de hover (que se sobrepõem)
    const hoverLabels = g.append('g').attr('class', 'hover-labels').style('opacity', 0);
    
    // 11. Adicionar os rótulos fixos (que não têm sobreposição)

    labelData.forEach((d, i) => {
      if (!overlapping.has(i)) {
        fixedLabels.append('text')
          .attr('x', d.labelX)
          .attr('y', d.labelY)
          .attr('font-size', '0.75rem')
          .attr('fill', '#22223b')
          .attr('stroke', 'white')
          .attr('stroke-width', '0.3px')
          .attr('paint-order', 'stroke')
          .text(d.name);
      }
    });

    // 12. Configurar interação de hover para mostrar rótulos sobrepostos
    points.on('mouseover', function(event, d) {
      const i = labelData.findIndex(item => item.id === d.id);
      
      // Destaca o ponto
      d3.select(this)
        .transition()
        .duration(150)
        .attr('r', 8)
        .attr('stroke-width', 2);
      
      // Se o rótulo está na lista de sobrepostos, mostra-o
      if (overlapping.has(i)) {
        // Limpa rótulos anteriores
        hoverLabels.selectAll('*').remove();
        
        // Adiciona linha conectora
        hoverLabels
          .append('line')
          .attr('x1', xScale(d.x))
          .attr('y1', yScale(d.y))
          .attr('x2', labelData[i].labelX)
          .attr('y2', labelData[i].labelY)
          .attr('stroke', '#22223b')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '2,2');
        
        // Adiciona o rótulo
        hoverLabels
          .append('text')
          .attr('x', labelData[i].labelX)
          .attr('y', labelData[i].labelY)
          .attr('font-size', '0.75rem')
          .attr('fill', '#22223b')
          .attr('stroke', 'white')
          .attr('stroke-width', '0.3px')
          .attr('paint-order', 'stroke')
          .text(d.name);
        
        // Torna o grupo visível
        hoverLabels.style('opacity', 1);
      }
      
      // Mostra tooltip em todos os casos
      tooltip
        .html(`
          <div class="font-semibold">${d.name}</div>
          <div>Tamanho: ${d.size}</div>
          <div>Lead: ${d.leadPotential}</div>
          <div>Investimento: ${d.investmentPotential}</div>
          <div>Engajamento: ${d.engagement}</div>
        `)
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 10}px`)
        .style('display', 'block');
    })
    .on('mousemove', function(event) {
      tooltip
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 10}px`);
    })
    .on('mouseout', function() {
      // Restaura o tamanho do ponto
      d3.select(this)
        .transition()
        .duration(150)
        .attr('r', 5)
        .attr('stroke-width', 1.5);
      
      // Esconde o rótulo de hover
      hoverLabels.style('opacity', 0);
      
      // Esconde o tooltip
      tooltip.style('display', 'none');
    });

    // 13. Adiciona títulos dos eixos
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', '0.9rem')
      .text('Potencial de Geração de Leads');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', '0.9rem')
      .text('Potencial de Investimento');
      
  }, [partners, onSelectPartner]);

  return (
    <div className="relative w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
      <div ref={tooltipRef} className="absolute hidden bg-white p-2 rounded shadow-md text-sm z-10" />
    </div>
  );
};

export default QuadrantChart;
