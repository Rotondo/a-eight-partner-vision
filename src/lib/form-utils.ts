
import { Partner } from "../types/partner";
import { toast } from "../components/ui/sonner";

export const validatePartnerForm = (partner: Partner): boolean => {
  if (!partner.name.trim()) {
    toast.error("Nome do parceiro é obrigatório");
    return false;
  }
  
  return true;
};
