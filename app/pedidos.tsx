import React, { useState, useEffect, useMemo } from 'react'; // 1. Importamos useMemo
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    TextInput,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { supabase } from '../lib/supabase';

const PedidoItem = ({ nome }: { nome: string }) => (
    <TouchableOpacity style={styles.pedidoItem}>
        <Text style={styles.pedidoNome}>{nome}</Text>
    </TouchableOpacity>
);

export default function TelaPedidos() {
    const [todosPedidos, setTodosPedidos] = useState<any[]>([]); // Armazena a lista original, sem filtros
    const [textoPesquisa, setTextoPesquisa] = useState(''); // 2. Estado para guardar o texto da pesquisa
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from('Vendas-2025')
            .select(`
        id_venda,
        Data,
        Total,
        Clientes ( Nome ) 
      `)
            .eq('Pago', true);

        if (error) {
            console.error('Erro ao buscar pedidos:', error);
        } else {
            setTodosPedidos(data || []); // Guarda a lista completa e original
        }
        setLoading(false);
    };

    // 3. Lógica para filtrar os pedidos com base no texto da pesquisa
    const pedidosFiltrados = useMemo(() => {
        if (!textoPesquisa) {
            return todosPedidos; // Se a pesquisa estiver vazia, retorna a lista completa
        }
        // Retorna apenas os pedidos cujo nome do cliente (em minúsculas) inclui o texto da pesquisa (em minúsculas)
        return todosPedidos.filter(pedido =>
            pedido.Clientes?.Nome.toLowerCase().includes(textoPesquisa.toLowerCase())
        );
    }, [todosPedidos, textoPesquisa]); // Esta função só é re-executada quando a lista original ou o texto da pesquisa mudam


    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#5C8E8B" />
                </View>
            </SafeAreaView>
        );
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
                        <Link href="/" asChild>
                            <TouchableOpacity style={styles.backButton}>
                                <FontAwesome5 name="arrow-left" size={24} color="#333" />
                            </TouchableOpacity>
                        </Link>
                        <FontAwesome5 name="clipboard-list" size={30} color="#333" style={styles.headerIcon} />
                        <Text style={styles.headerTitle}>Pedidos</Text>
                    </View>

                    {/* 4. Conectamos o TextInput ao nosso estado */}
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Pesquise aqui pelo nome..."
                            placeholderTextColor="#888"
                            value={textoPesquisa} 
                            onChangeText={setTextoPesquisa} 
                        />
                        <FontAwesome5 name="search" size={20} color="#888" style={styles.searchIcon} />
                    </View>

                    <View style={styles.filterContainer}>
                        <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
                            <Text style={[styles.filterButtonText, styles.filterButtonTextActive]}>Finalizados</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterButton}>
                            <Text style={styles.filterButtonText}>Pendentes</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={pedidosFiltrados}
                        renderItem={({ item }) => <PedidoItem nome={item.Clientes?.Nome || 'Cliente não encontrado'} />}
                        keyExtractor={item => item.id_venda.toString()}
                        contentContainerStyle={styles.pedidosList}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

// Seus estilos (sem mudanças)
const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F1E9' },
    safeArea: { flex: 1, backgroundColor: '#F4F1E9' },
    container: { flex: 1 },
    circle: { position: 'absolute', opacity: 0.7 },
    circleOne: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#D9A583', top: -50, left: -80 },
    circleTwo: { width: 300, height: 300, borderRadius: 150, backgroundColor: '#9FB5A8', top: 100, right: -120 },
    circleThree: { width: 250, height: 250, borderRadius: 125, backgroundColor: '#8C5F54', bottom: -80, left: -100 },
    circleFour: { width: 350, height: 350, borderRadius: 175, backgroundColor: '#D9C47E', bottom: -150, right: -100 },
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