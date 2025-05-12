
export interface Partner {
  id?: string;
  name: string;
  leadPotential: string;
  investmentPotential: string;
  size: string;
  engagement: string;
}

export const companySize = ["PP", "P", "M", "G", "GG"];

export const sizeColorMap: Record<string, string> = {
  PP: "#FF6B6B",
  P: "#FFD93D",
  M: "#6BCB77",
  G: "#4D96FF",
  GG: "#9B59B6"
};

export const potentialOptions = ["0", "1", "2", "3", "4", "5"];

export const engagementOptions = ["0", "1", "2", "3", "4", "5"];

export const defaultPartner: Partner = {
  name: "",
  leadPotential: "0",
  investmentPotential: "0",
  size: "PP",
  engagement: "0"
};
