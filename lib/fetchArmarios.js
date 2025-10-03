import { supabase } from '../supabase/supabase.ts'

export async function fetchArmarios() {
    const { data, error } = await supabase
        .from('Armários')
        .select(`
            N_armario,
            Corredor,
            preco: "Preco(R$)",
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
            N_armario,
            Corredor,
            preco: "Preco(R$)",
            Disponivel,
            Funcional,
            Vendas_armários(id_venda, Contrato)
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

    if (error) {
        console.error('Erro ao buscar dono do armário: ', error)
        return []
    }

    return data
}

export async function fetchVendaPorId(id_venda) {
    const { data, error } = await supabase
        .from('Vendas-2025')
        .select('Data')
        .eq('id_venda', id_venda)
        .single();

    if (error) {
        console.error('Erro ao buscar dados da venda:', error);
        return null;
    }

    return data;
}

export async function mudarDisponibilidadeArmario(n_armario, novoStatus) {
    const { data, error } = await supabase
        .from('Armários')
        .update({ Disponivel: novoStatus })
        .eq('N_armario', n_armario)

    if (error) {
        console.error('Erro ao atualizar disponibilidade do armário: ', error)
    }
}


export async function detectarObjetoArmario() {
    const resposta = await fetch("http://192.168.15.76:3000/distancia/enviar")
    const objetoArmario = await resposta.json()
    detectarUtilizacao(objetoArmario.armario, objetoArmario.objeto_detectado)
    console.log(objetoArmario)
}

export async function detectarUtilizacao(armario, utilizacao) {
    const { data, error } = await supabase
        .from('Armários')
        .select('Utilizado')
        .eq('N_armario', armario)

    if (error) {
        console.error('Erro ao buscar utilização do armário: ', error)
    } else if (data[0]?.Utilizado != utilizacao) {
        await mudarUtilizacao(armario, utilizacao)
    }
}

export async function mudarUtilizacao(armario, utilizacao) {
    const { error } = await supabase
        .from('Armários')
        .update({ Utilizado: utilizacao })
        .eq('N_armario', armario)

    if (error) {
        console.error('Erro au atualizar utilização: ', error)
    }
}

export async function fetchPrecoPadraoArmario() {
    const { data, error } = await supabase
        .from('Armários')
        .select('preco: "Preco(R$)"')
        .limit(1)
        .single()

    if (error) {
        console.error('Erro ao buscar preço do armário:', error)
        return null
    }
    return data?.preco
}