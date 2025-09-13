import { supabase } from "@/lib/supabase";

export async function fetchPedidosFinalizados() {
    const { data, error } = await supabase.from('Vendas-2025').select(`id_venda,Data,Total,Pago,Clientes ( Nome )`).eq('Compra_finalizada', true);
    if (error) console.error('Erro ao buscar pedidos:', error);
    return data;
}

export async function fetchPedidosPendentes() {
    const { data, error } = await supabase.from('Vendas-2025').select(`id_venda,Data,Total,Pago,Clientes ( Nome )`).eq('Compra_finalizada', false);
    if (error) console.error('Erro ao buscar pedidos:', error);
    return data;
}

export async function fetchPedido(id_venda: number) {
    const { data, error } = await supabase.from('Vendas-2025').select(`id_venda,Data,Forma_de_pagamento,Total,Pago,Retirado,Clientes ( Nome )`).eq('id_venda', id_venda);
    if (error) console.error('Erro ao buscar pedido:', error);
    return data;
}

export async function fetchDetalhesPedidosUniforme(id_venda: number) {
    const { data, error } = await supabase.from('Vendas_uniformes').select(`id,Qtd,Preco_total,Uniformes (Nome),Estoque_uniforme ( Tamanho )`).eq('id_venda', id_venda);
    if (error) console.error('Erro ao buscar detalhes de uniformes:', error);
    return data;
}

export async function fetchDetalhesPedidosArmario(id_venda: number) {
    const { data, error } = await supabase.from('Vendas_armários').select(`id,N_armario,Armários ( preco_final: "Preco(R$)" )`).eq('id_venda', id_venda);
    if (error) {
        console.error('Erro ao buscar detalhes de armários:', error);
    }
    return data;
}

export async function updateStatusPagamento(id_venda: number, novoStatus: boolean) {
    const { error } = await supabase.from('Vendas-2025').update({ Pago: novoStatus }).eq('id_venda', id_venda);
    if (error) console.error('Erro ao atualizar pagamento:', error);
    return { error };
}

export async function updateStatusRetirada(id_venda: number, novoStatus: boolean) {
    const { error } = await supabase.from('Vendas-2025').update({ Retirado: novoStatus }).eq('id_venda', id_venda);
    if (error) console.error('Erro ao atualizar retirada:', error);
    return { error };
}

export async function updateCompraFinalizada(id_venda: number, novoStatus: boolean) {
    const { error } = await supabase.from('Vendas-2025').update({ Compra_finalizada: novoStatus }).eq('id_venda', id_venda);
    if (error) console.error('Erro ao finalizar compra:', error);
    return { error };
}

export async function checkIfVendaHasUniformes(id_venda: number) {
    const { data, error } = await supabase.from('Vendas_uniformes').select('id').eq('id_venda', id_venda).limit(1);
    if (error) console.error('Erro ao checar uniformes na venda:', error);
    return data && data.length > 0;
}