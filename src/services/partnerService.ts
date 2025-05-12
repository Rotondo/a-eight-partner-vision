
import { Partner } from "../types/partner";
import { toast } from "../components/ui/sonner";
import { createClient } from '@supabase/supabase-js';

// Inicialização do cliente Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para converter o parceiro para o formato do Supabase
const convertToDbFormat = (partner: Partner) => {
  return {
    name: partner.name,
    lead_potential: Number(partner.leadPotential),
    investment_potential: Number(partner.investmentPotential),
    size: partner.size,
    engagement: Number(partner.engagement),
    strategic_alignment: Number(partner.strategicAlignment || 0)
  };
};

// Função para converter do formato do Supabase para nosso modelo
const convertFromDbFormat = (dbPartner: any): Partner => {
  return {
    id: dbPartner.id,
    name: dbPartner.name,
    leadPotential: String(dbPartner.lead_potential),
    investmentPotential: String(dbPartner.investment_potential),
    size: dbPartner.size,
    engagement: String(dbPartner.engagement),
    strategicAlignment: dbPartner.strategic_alignment ? String(dbPartner.strategic_alignment) : "0"
  };
};

export const savePartner = async (partner: Partner): Promise<Partner> => {
  try {
    console.log("Saving partner to Supabase:", partner);
    
    const { data, error } = await supabase
      .from('partners')
      .insert([convertToDbFormat(partner)])
      .select();
    
    if (error) {
      console.error("Error saving partner:", error);
      toast.error("Erro ao salvar parceiro");
      throw error;
    }
    
    toast.success("Parceiro salvo com sucesso");
    return convertFromDbFormat(data[0]);
  } catch (error) {
    console.error("Error saving partner:", error);
    toast.error("Erro ao salvar parceiro");
    throw error;
  }
};

export const getPartners = async (): Promise<Partner[]> => {
  try {
    console.log("Fetching partners from Supabase");
    
    const { data, error } = await supabase
      .from('partners')
      .select('*');
    
    if (error) {
      console.error("Error fetching partners:", error);
      toast.error("Erro ao buscar parceiros");
      throw error;
    }
    
    return data.map(convertFromDbFormat);
  } catch (error) {
    console.error("Error fetching partners:", error);
    toast.error("Erro ao buscar parceiros");
    throw error;
  }
};

export const updatePartner = async (partner: Partner): Promise<Partner> => {
  try {
    console.log("Updating partner in Supabase:", partner);
    
    if (!partner.id) {
      throw new Error("Partner ID is required for update");
    }
    
    const { data, error } = await supabase
      .from('partners')
      .update(convertToDbFormat(partner))
      .eq('id', partner.id)
      .select();
    
    if (error) {
      console.error("Error updating partner:", error);
      toast.error("Erro ao atualizar parceiro");
      throw error;
    }
    
    toast.success("Parceiro atualizado com sucesso");
    return convertFromDbFormat(data[0]);
  } catch (error) {
    console.error("Error updating partner:", error);
    toast.error("Erro ao atualizar parceiro");
    throw error;
  }
};

export const deletePartner = async (id: string): Promise<void> => {
  try {
    console.log("Deleting partner from Supabase:", id);
    
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting partner:", error);
      toast.error("Erro ao excluir parceiro");
      throw error;
    }
    
    toast.success("Parceiro excluído com sucesso");
  } catch (error) {
    console.error("Error deleting partner:", error);
    toast.error("Erro ao excluir parceiro");
    throw error;
  }
};
