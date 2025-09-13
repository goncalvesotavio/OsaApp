import { supabase } from '@/supabase/supabase'

export async function fetchArmarios() {
    const { data, error } = await supabase
      .from('Armários')
      .select(`
        N_aramario,
        Corredor,
        Preco(R$),
        Disponivel
      `)

    if (error) {
        console.error('Erro ao buscar armários: ', error)
        return []
    }

    return data
}

export async function buscarArmario(n_armario) {
    const { data, error } = await supabase
      .from('Armários')
      .select(`
        N_aramario,
        Corredor,
        Preco(R$),
        Disponivel,
        Contrato,
        Vendas_armarios(id_venda)
      `)
      .eq('N_armario', n_armario)

    if (error) {
        console.error('Erro ao buscar armários: ', error)
        return []
    }

    return data
}

export async function buscarClienteArmario(id_venda) {
    const { data, error } = await supabase
      .from('Vendas-2025')
      .select(`
        Clientes(
        Nome,
        RM,
        Tipo_curso,
        Curso,
        Serie)
      `)
      .eq('id_venda', id_venda)

      if(error) {
        console.error('Erro ao buscar dono do armário: ', error)
        return []
      }

      return data
}

export async function mudarDisponibilidadeArmario(n_armario, novoStatus) {
    const { data, error } = await supabase
      .from('Armários')
      .update({ Disponivel: novoStatus })
      .ep('N_armario', n_armario)

      if (error) {
        console.error('Erro ao atualizar disponibilidade do armário: ', error)
      }
}