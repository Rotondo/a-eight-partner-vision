
import { Partner } from '../types/partner';
import { supabase } from '../lib/supabaseClient';
import { toast } from '../components/ui/sonner';

// Função para converter um objeto Partner para o formato do banco de dados (camelCase → snake_case)
const toDbFormat = (partner: Partner) => {
  return {
    name: partner.name,
    lead_potential: partner.leadPotential,
    investment_potential: partner.investmentPotential,
    size: partner.size,
    engagement: partner.engagement,
    strategic_alignment: partner.strategicAlignment || 0,
    alert_status: partner.alertStatus || 'ok'
  };
};

// Função para converter do formato do banco de dados para o formato do frontend (snake_case → camelCase)
const fromDbFormat = (dbPartner: any): Partner => {
  return {
    id: dbPartner.id,
    name: dbPartner.name,
    leadPotential: dbPartner.lead_potential,
    investmentPotential: dbPartner.investment_potential,
    size: dbPartner.size,
    engagement: dbPartner.engagement,
    strategicAlignment: dbPartner.strategic_alignment,
    alertStatus: dbPartner.alert_status || 'ok'
  };
};

export const getPartners = async (): Promise<Partner[]> => {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    toast.error('Erro ao carregar parceiros');
    throw error;
  }

  // Converte os dados recebidos para o formato do frontend
  return data?.map(fromDbFormat) || [];
};

export const savePartner = async (partner: Partner): Promise<Partner> => {
  // Converte o parceiro para o formato do banco de dados
  const dbPartner = toDbFormat(partner);
  
  const { data, error } = await supabase
    .from('partners')
    .insert(dbPartner)
    .select()
    .single();

  if (error) {
    console.error("Erro detalhado:", error);
    toast.error(`Erro ao salvar parceiro: ${error.message}`);
    throw error;
  }

  toast.success('Parceiro salvo com sucesso');
  return fromDbFormat(data);
};

export const updatePartner = async (partner: Partner): Promise<Partner> => {
  if (!partner.id) throw new Error('ID do parceiro é obrigatório');

  // Converte o parceiro para o formato do banco de dados
  const dbPartner = toDbFormat(partner);
  
  const { data, error } = await supabase
    .from('partners')
    .update(dbPartner)
    .eq('id', partner.id)
    .select()
    .single();

  if (error) {
    toast.error('Erro ao atualizar parceiro');
    throw error;
  }

  toast.success('Parceiro atualizado');
  return fromDbFormat(data);
};

export const deletePartner = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('partners')
    .delete()
    .eq('id', id);

  if (error) {
    toast.error('Erro ao excluir parceiro');
    throw error;
  }

  toast.success('Parceiro excluído');
};
