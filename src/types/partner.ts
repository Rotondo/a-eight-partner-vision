// src/types/partner.ts

// Interface principal do parceiro, usando tipos corretos
export interface Partner {
  id?: string;
  name: string;
  leadPotential: number;          // Agora é number
  investmentPotential: number;    // Agora é number
  size: 'PP' | 'P' | 'M' | 'G' | 'GG';
  engagement: number;             // Agora é number
  strategicAlignment?: number;    // Opcional, mas number
}

// Opções para seleção nos formulários
export const companySize = ["PP", "P", "M", "G", "GG"] as const;

export const sizeColorMap: Record<Partner["size"], string> = {
  PP: "#FF6B6B",
  P: "#FFD93D",
  M: "#6BCB77",
  G: "#4D96FF",
  GG: "#9B59B6"
};

export const potentialOptions = [0, 1, 2, 3, 4, 5];
export const engagementOptions = [0, 1, 2, 3, 4, 5];
export const strategicAlignmentOptions = [0, 1, 2, 3, 4, 5];

// Valor padrão para um novo parceiro
export const defaultPartner: Partner = {
  name: "",
  leadPotential: 0,
  investmentPotential: 0,
  size: "PP",
  engagement: 0,
  strategicAlignment: 0
};
