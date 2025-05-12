
import { Partner } from "../types/partner";
import { toast } from "../components/ui/sonner";

export const validatePartnerForm = (partner: Partner): boolean => {
  if (!partner.name.trim()) {
    toast.error("Nome do parceiro é obrigatório");
    return false;
  }
  
  return true;
};

// Helper function to calculate position for chart coordinates
export const calculateChartPosition = (partner: Partner) => {
  // Parse values to numbers
  const leadPotential = Number(partner.leadPotential);
  const investmentPotential = Number(partner.investmentPotential);
  const engagement = Number(partner.engagement);
  const strategicAlignment = Number(partner.strategicAlignment || 0);
  
  // Convert size to a numeric value for calculations
  const sizeValue = {
    'PP': 1,
    'P': 2,
    'M': 3,
    'G': 4,
    'GG': 5
  }[partner.size] || 1;
  
  // Calculate X coordinate (Leads)
  // (Potencial de Leads × 0.4) + (Base de Clientes × 0.3) + (Engajamento × 0.2) + (Alinhamento × 0.1)
  const xValue = (leadPotential * 0.4) + (sizeValue * 0.3) + (engagement * 0.2) + (strategicAlignment * 0.1);
  
  // Calculate Y coordinate (Investment)
  // (Potencial de Investimento × 0.5) + (Tamanho × 0.3) + (Engajamento × 0.2)
  const yValue = (investmentPotential * 0.5) + (sizeValue * 0.3) + (engagement * 0.2);
  
  return { x: xValue, y: yValue };
};
