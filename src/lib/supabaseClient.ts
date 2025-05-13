
import { createClient } from '@supabase/supabase-js';

// Definição de valores padrão para desenvolvimento
const FALLBACK_URL = 'https://sua-url-supabase.supabase.co'; // Substitua por um valor padrão se desejar
const FALLBACK_KEY = 'sua-chave-publica-anonima'; // Substitua por um valor padrão se desejar

// Tenta obter variáveis de ambiente, ou usa valores padrão
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY;

// Cria cliente Supabase apenas se as variáveis estiverem definidas
let supabase = null;

try {
  if (supabaseUrl === 'https://sua-url-supabase.supabase.co' || 
      supabaseAnonKey === 'sua-chave-publica-anonima') {
    console.warn('⚠️ Usando valores padrão do Supabase. Configure as variáveis de ambiente:');
    console.warn('VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
    
    // Cliente mock que não faz nada, mas não quebra a aplicação
    supabase = {
      from: () => ({
        select: () => ({ 
          data: [], 
          error: null,
          order: () => ({ data: [], error: null })
        }),
        insert: () => ({ 
          select: () => ({
            data: null, 
            error: null,
            single: () => ({ data: null, error: null })
          })
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => ({ data: null, error: null })
            })
          })
        }),
        delete: () => ({
          eq: () => ({ data: null, error: null })
        })
      })
    };
  } else {
    // Cria cliente Supabase real com as credenciais fornecidas
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false
      }
    });
    console.log('✅ Conectado ao Supabase com sucesso!');
  }
} catch (error) {
  console.error('Erro ao inicializar o cliente Supabase:', error);
}

export { supabase };
