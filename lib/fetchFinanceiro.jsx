import { supabase } from '@/supabase/supabase'

export async function arrecadacaoTotal() {
    const { data, error } = await supabase
      .from('Vendas-2025')
      .select('Total')

      if (error) {
        console.error('Erro ao buscar arrecadação total: ', error)
        return 0
      }

    const totalArrecadado = data?.reduce ((soma, venda) => soma + (venda.Total || 0), 0) || 0

    return totalArrecadado
}

export async function arrecadacaoTotalUniformes() {
    const { data, error } = await supabase
      .from('Vendas_uniformes')
      .select('Preco_total')

      if (error) {
        console.error('Erro ao buscar arrecadação de uniformes: ', error)
        return 0
      }

      const totalUniformesArrecadados = data?.reduce ((soma, venda) => soma + (venda.Preco_total || 0), 0) || 0

      return totalUniformesArrecadados
}

export async function arrecadacaoUniforme(id_uniforme) {
    const { data, error } = await supabase
      .from('Vendas_uniformes')
      .select('Preco_total')
      .eq('id_uniforme', id_uniforme)

      if (error) {
        console.error('Erro ao buscar arrecadação do uniforme: ', error)
        return 0
      }

      const uniformeArrecadados = data?.reduce ((soma, venda) => soma + (venda.Preco_total || 0), 0) || 0

      return uniformeArrecadados
}

export async function arrecadacaoUniformeTamanho(id_estoque) {
    const { data, error } = await supabase
      .from('Vendas_uniformes')
      .select('Preco_total')
      .eq('Tamanho', id_estoque)

      if (error) {
        console.error('Erro ao buscar arrecadação do tamanho do uniforme: ', error)
        return 0
      }

      const uniformeTamanhoArrecadados = data?.reduce ((soma, venda) => soma + (venda.Preco_total || 0), 0) || 0

      return uniformeTamanhoArrecadados
}

export async function arrecadacaoArmarios() {
    const { data, error } = await supabase
      .from('Armários')
      .select(`Preco(R$)`)
      .eq('Disponivel', false)

      if (error) {
        console.error('Erro ao buscar arrecadação dos armários: ', error)
        return 0
      }

    const arrecadacaoArmarios = data?.reduce ((soma, armario) => soma + (armario['Preco(R$'] || 0), 0) || 0

    return arrecadacaoArmarios
}