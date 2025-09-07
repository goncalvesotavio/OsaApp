import { supabase } from "@/lib/supabase";

export async function fetchPedidosFinalizados() {
    const { data, error } = await supabase
        .from('Vendas-2025')
        .select(`
            id_venda,
            Data,
            Total,
            Pago,
            Clientes ( Nome ) 
        `)
        .eq('Compra_finalizada', true)

    if (error) {
        console.error('Erro ao buscar pedidos:', error)
    } 

    return data
} 

export async function fetchPedidosPendentes() {
    const { data, error } = await supabase
        .from('Vendas-2025')
        .select(`
            id_venda,
            Data,
            Total,
            Pago,
            Clientes ( Nome ) 
        `)
        .eq('Compra_finalizada', false)

    if (error) {
        console.error('Erro ao buscar pedidos:', error)
    } 

    return data
}

export async function fetchPedido(id_venda: number) {
    const { data, error } = await supabase
        .from('Vendas-2025')
        .select(`
            id_venda,
            Data,
            Forma_de_pagamento,
            Total,
            Pago,
            Clientes ( Nome ) 
        `)
        .eq('id_venda', id_venda)

    if (error) {
        console.error('Erro ao buscar pedidos:', error)
    } 

    return data
}

export async function fetchDetalhesPedidosUniforme(id_venda: number) {
    const { data, error } = await supabase
        .from('Vendas_uniformes')
        .select(`
            id,
            id_venda,
            id_uniforme,
            Qtd,
            Preco_unitario,
            Preco_total,
            Tamanho,
            Uniformes (Nome),
            Estoque_uniforme (Tamanho)
        `)
        .eq('id_venda', id_venda)

        if (error) {
            console.error('Erro ao buscar pedidos:', error)
        } 

        return data
}