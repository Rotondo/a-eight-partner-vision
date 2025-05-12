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

/**
 * Valida os dados do parceiro antes do envio
 * @param partner - Objeto Partner a ser validado
 * @returns Retorna true se os dados são válidos
 */
export const validatePartnerForm = (partner: Partner): boolean => {
  // Validação do nome
  if (!partner.name.trim()) {
    toast.error("Nome do parceiro é obrigatório");
    return false;
  }

  // Validação dos valores numéricos
  const numericFields: Array<keyof Partner> = [
    'leadPotential', 
    'investmentPotential', 
    'engagement', 
    'strategicAlignment'
  ];

  for (const field of numericFields) {
    const value = partner[field] || 0;
    if (value < VALIDATION_RANGE.min || value > VALIDATION_RANGE.max) {
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
  // Valores diretos (já são numbers)
  const { 
    leadPotential, 
    investmentPotential, 
    engagement, 
    strategicAlignment = 0 
  } = partner;

  // Valor numérico do tamanho
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

  // Garante valores dentro do range 0-5
  return {
    x: Math.min(Math.max(xValue, 0), 5),
    y: Math.min(Math.max(yValue, 0), 5)
  };
};
