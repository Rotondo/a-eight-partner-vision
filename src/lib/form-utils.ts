// src/lib/form-utils.ts
import { Partner } from "../types/partner";
import { toast } from "../components/ui/sonner";

// Tipo para mapeamento de tamanho para valores numéricos
type SizeValues = Record<Partner['size'], number>;

// Constantes para cálculos
const SIZE_WEIGHTS: SizeValues = {
  'PP': 1,
  'P': 2,
  'M': 3,
  'G': 4,
  'GG': 5
};

const VALIDATION_RANGE = { min: 0, max: 5 };
const CHART_RANGE = { min: 0, max: 5 };
const QUADRANT_LABELS = [
  { text: "Baixo Lead\nBaixo Investimento", x: 1.25, y: 1.25 },
  { text: "Alto Lead\nBaixo Investimento", x: 3.75, y: 1.25 },
  { text: "Baixo Lead\nAlto Investimento", x: 1.25, y: 3.75 },
  { text: "Alto Lead\nAlto Investimento", x: 3.75, y: 3.75 }
];

/**
 * Valida os dados do parceiro antes do envio
 * @param partner - Objeto Partner a ser validado
 * @returns Retorna true se os dados são válidos
 */
export const validatePartnerForm = (partner: Partner): boolean => {
  if (!partner.name.trim()) {
    toast.error("Nome do parceiro é obrigatório");
    return false;
  }

  const numericFields: Array<keyof Partner> = [
    'leadPotential', 
    'investmentPotential', 
    'engagement', 
    'strategicAlignment'
  ];

  for (const field of numericFields) {
    const value = partner[field] || 0;
    if (isNaN(value) || value < VALIDATION_RANGE.min || value > VALIDATION_RANGE.max) {
      toast.error(`${field} deve estar entre ${VALIDATION_RANGE.min} e ${VALIDATION_RANGE.max}`);
      return false;
    }
  }

  return true;
};

/**
 * Calcula a posição do parceiro no quadrante
 * @param partner - Objeto Partner com os dados necessários
 * @returns Objeto com coordenadas X e Y normalizadas
 */
export const calculateChartPosition = (partner: Partner): { x: number; y: number } => {
  const { 
    leadPotential, 
    investmentPotential, 
    engagement, 
    strategicAlignment = 0 
  } = partner;

  const sizeValue = SIZE_WEIGHTS[partner.size];

  // Cálculo da posição X (Potencial de Leads)
  const xValue = (leadPotential * 0.4) + 
                (sizeValue * 0.3) + 
                (engagement * 0.2) + 
                (strategicAlignment * 0.1);

  // Cálculo da posição Y (Potencial de Investimento)
  const yValue = (investmentPotential * 0.5) + 
                (sizeValue * 0.3) + 
                (engagement * 0.2);

  return {
    x: clampValue(xValue),
    y: clampValue(yValue)
  };
};

/**
 * Cria a configuração base do gráfico
 * @param width - Largura do contêiner do gráfico
 * @param height - Altura do contêiner do gráfico
 * @returns Objeto com escalas e elementos do quadrante
 */
export const getChartConfig = (width: number, height: number) => {
  const margin = { top: 40, right: 40, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Escalas
  const xScale = (value: number) => 
    (value / CHART_RANGE.max) * innerWidth;
    
  const yScale = (value: number) => 
    innerHeight - (value / CHART_RANGE.max) * innerHeight;

  // Linhas do quadrante
  const quadrantLines = [
    {
      type: 'vertical',
      x1: xScale(2.5),
      y1: 0,
      x2: xScale(2.5),
      y2: innerHeight
    },
    {
      type: 'horizontal',
      x1: 0,
      y1: yScale(2.5),
      x2: innerWidth,
      y2: yScale(2.5)
    }
  ];

  return {
    margin,
    innerWidth,
    innerHeight,
    xScale,
    yScale,
    quadrantLines,
    quadrantLabels: QUADRANT_LABELS.map(label => ({
      ...label,
      x: xScale(label.x),
      y: yScale(label.y)
    }))
  };
};

// Função auxiliar para limitar valores entre 0-5
const clampValue = (value: number): number => {
  return Math.min(Math.max(value, CHART_RANGE.min), CHART_RANGE.max);
};
