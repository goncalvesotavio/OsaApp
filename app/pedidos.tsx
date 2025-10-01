import { FontAwesome5 } from '@expo/vector-icons'
import { Link, useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchPedidosFinalizados, fetchPedidosPendentes } from '@/lib/fetchPedidos'
import { supabase } from '@/supabase/supabase'

const PedidoItem = ({ nome, id_venda }: { nome: string, id_venda: number }) => (
    <Link href={`/pedidos/${id_venda}`} asChild>
        <TouchableOpacity style={styles.pedidoItem}>
            <Text style={styles.pedidoNome}>{nome}</Text>
        </TouchableOpacity>
    </Link>
);

export default function TelaPedidos() {
    const [filtroAtivo, setFiltroAtivo] = useState<'finalizados' | 'pendentes'>('finalizados');
    const [listaPedidosFinalizados, setListaPedidosFinalizados] = useState<any[]>([])
    const [listaPedidosPendentes, setListaPedidosPendentes] = useState<any[]>([])
    const [textoPesquisa, setTextoPesquisa] = useState('')
    const [loading, setLoading] = useState(true)

    const listarFinalizados = async () => {
        try {
            const finalizados = await fetchPedidosFinalizados()
            setListaPedidosFinalizados(finalizados || [])
        } catch (error) {
            setListaPedidosFinalizados([])
        }
    }

    const listarPendentes = async () => {
        try {
            const pendentes = await fetchPedidosPendentes()
            setListaPedidosPendentes(pendentes || [])
        } catch (error) {
            setListaPedidosPendentes([])
        }
    }

    const carregarPedidosIniciais = useCallback(() => {
        setLoading(true);
        Promise.all([listarFinalizados(), listarPendentes()]).finally(() => {
            setLoading(false)
        });
    }, []);

    useFocusEffect(
        carregarPedidosIniciais
    );

    useEffect(() => {
        const channel = supabase
            .channel('vendas_realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'Vendas-2025' },
                () => {
                    carregarPedidosIniciais();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [carregarPedidosIniciais]); 

    const pedidosFinalizadosFiltrados = useMemo(() => {
        if (!textoPesquisa) {
            return listaPedidosFinalizados
        }
        return listaPedidosFinalizados.filter(pedido =>
            pedido.Clientes?.Nome.toLowerCase().includes(textoPesquisa.toLowerCase())
        )
    }, [listaPedidosFinalizados, textoPesquisa]);

    const pedidosPendentesFiltrados = useMemo(() => {
        if (!textoPesquisa) {
            return listaPedidosPendentes;
        }
        return listaPedidosPendentes.filter(pedido =>
            pedido.Clientes?.Nome.toLowerCase().includes(textoPesquisa.toLowerCase())
        );
    }, [listaPedidosPendentes, textoPesquisa]);

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#5C8E8B" />
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F1E9" />
            <View style={styles.container}>
                <View style={[styles.circle, styles.circleOne]} />
                <View style={[styles.circle, styles.circleTwo]} />
                <View style={[styles.circle, styles.circleThree]} />
                <View style={[styles.circle, styles.circleFour]} />
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Link href="/" asChild><TouchableOpacity style={styles.backButton}><FontAwesome5 name="arrow-left" size={24} color="#333" /></TouchableOpacity></Link>
                        <FontAwesome5 name="clipboard-list" size={30} color="#333" style={styles.headerIcon} />
                        <Text style={styles.headerTitle}>Pedidos</Text>
                    </View>
                    <View style={styles.searchContainer}>
                        <TextInput style={styles.searchInput} placeholder="Pesquise aqui pelo nome..." placeholderTextColor="#888" value={textoPesquisa} onChangeText={setTextoPesquisa} />
                        <FontAwesome5 name="search" size={20} color="#888" style={styles.searchIcon} />
                    </View>
                    <View style={styles.filterContainer}>
                        <TouchableOpacity style={[styles.filterButton, filtroAtivo === 'finalizados' && styles.filterButtonActive]} onPress={() => setFiltroAtivo('finalizados')}>
                            <Text style={[styles.filterButtonText, filtroAtivo === 'finalizados' && styles.filterButtonTextActive]}>Finalizados</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.filterButton, filtroAtivo === 'pendentes' && styles.filterButtonActive]} onPress={() => setFiltroAtivo('pendentes')}>
                            <Text style={[styles.filterButtonText, filtroAtivo === 'pendentes' && styles.filterButtonTextActive]}>Pendentes</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={filtroAtivo === 'finalizados' ? pedidosFinalizadosFiltrados : pedidosPendentesFiltrados}
                        renderItem={({ item }) => (<PedidoItem nome={item.Clientes?.Nome || 'Cliente não encontrado'} id_venda={item.id_venda} />)}
                        keyExtractor={item => item.id_venda.toString()}
                        contentContainerStyle={styles.pedidosList}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F1E9' },
    safeArea: { flex: 1, backgroundColor: '#F4F1E9' },
    container: { flex: 1 },
    circle: { position: 'absolute', opacity: 0.7 },
    circleOne: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#D9A583', top: -50, left: -80 },
    circleTwo: { width: 300, height: 300, borderRadius: 150, backgroundColor: '#9FB5A8', top: 100, right: -120 },
    circleThree: { width: 250, height: 250, borderRadius: 125, backgroundColor: '#8C5F54', bottom: 130, left: -100 },
    circleFour: { width: 350, height: 350, borderRadius: 175, backgroundColor: '#D9C47E', bottom: -130, right: -100 },
    content: { flex: 1, padding: 20 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingTop: 10 },
    backButton: { marginRight: 15, padding: 5 },
    headerIcon: { marginRight: 10 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 3 },
    searchInput: { flex: 1, fontSize: 16, color: '#333' },
    searchIcon: { marginLeft: 10 },
    filterContainer: { flexDirection: 'row', backgroundColor: '#E0E0E0', borderRadius: 15, marginBottom: 20, overflow: 'hidden' },
    filterButton: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: 'transparent' },
    filterButtonActive: { backgroundColor: '#5C8E8B' },
    filterButtonText: { fontSize: 16, fontWeight: '500', color: '#666' },
    filterButtonTextActive: { color: '#FFF' },
    pedidosList: { paddingBottom: 20 },
    pedidoItem: { backgroundColor: '#FFFFFF', paddingVertical: 15, paddingHorizontal: 20, marginBottom: 10, borderRadius: 10, borderBottomWidth: 1, borderBottomColor: '#eee', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 3 },
    pedidoNome: { fontSize: 18, color: '#333' },
});