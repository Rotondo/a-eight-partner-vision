
import { Partner } from "../types/partner";
import { toast } from "../components/ui/sonner";

// This will be replaced with Supabase integration later
export const savePartner = async (partner: Partner): Promise<Partner> => {
  try {
    // Placeholder for Supabase integration
    console.log("Saving partner:", partner);
    return partner;
  } catch (error) {
    console.error("Error saving partner:", error);
    toast.error("Erro ao salvar parceiro");
    throw error;
  }
};

export const getPartners = async (): Promise<Partner[]> => {
  try {
    // Placeholder for Supabase integration
    console.log("Fetching partners");
    
    // Return sample data for now
    return [];
  } catch (error) {
    console.error("Error fetching partners:", error);
    toast.error("Erro ao buscar parceiros");
    throw error;
  }
};

export const updatePartner = async (partner: Partner): Promise<Partner> => {
  try {
    // Placeholder for Supabase integration
    console.log("Updating partner:", partner);
    return partner;
  } catch (error) {
    console.error("Error updating partner:", error);
    toast.error("Erro ao atualizar parceiro");
    throw error;
  }
};

export const deletePartner = async (id: string): Promise<void> => {
  try {
    // Placeholder for Supabase integration
    console.log("Deleting partner:", id);
  } catch (error) {
    console.error("Error deleting partner:", error);
    toast.error("Erro ao excluir parceiro");
    throw error;
  }
};
