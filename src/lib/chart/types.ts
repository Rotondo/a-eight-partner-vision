
// Definir tipos para configuração do gráfico sem depender diretamente do namespace d3
export interface ChartConfig {
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  innerWidth: number;
  innerHeight: number;
  xScale: (value: number) => number;
  yScale: (value: number) => number;
  quadrantLines: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }>;
  quadrantLabels: Array<{
    x: number;
    y: number;
    text: string;
  }>;
}

export interface PartnerPosition {
  x: number;
  y: number;
  quadrant: number;
}
