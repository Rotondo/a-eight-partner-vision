import { Partner } from '../types/partner';
import { supabase } from '../lib/supabaseClient';
import { toast } from '../components/ui/sonner';

export const getPartners = async (): Promise<Partner[]> => {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    toast.error('Erro ao carregar parceiros');
    throw error;
  }

  return data as Partner[];
};

export const savePartner = async (partner: Partner): Promise<Partner> => {
  const { data, error } = await supabase
    .from('partners')
    .insert(partner)
    .select()
    .single();

  if (error) {
    toast.error('Erro ao salvar parceiro');
    throw error;
  }

  toast.success('Parceiro salvo com sucesso');
  return data as Partner;
};

export const updatePartner = async (partner: Partner): Promise<Partner> => {
  if (!partner.id) throw new Error('ID do parceiro é obrigatório');

  const { data, error } = await supabase
    .from('partners')
    .update(partner)
    .eq('id', partner.id)
    .select()
    .single();

  if (error) {
    toast.error('Erro ao atualizar parceiro');
    throw error;
  }

  toast.success('Parceiro atualizado');
  return data as Partner;
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
