import { fetchVendasUniformesPorPeriodo } from '@/lib/fetchFinanceiro'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { Link, Stack, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const UniformeIcon = require('../../assets/icons/uniformes gestao.png');

interface RelatorioItem {
    id: number;
    Nome: string;
    Img: string;
    Categoria: string;
    totalVendas: number;
    precoBase: number;
}
const categorias = [
    { label: "Todos", value: "Todos" },
    { label: "Camisetas", value: "Camiseta" },
    { label: "Agasalhos", value: "Casaco" },
    { label: "Calça e Short", value: ['Calca', 'Short'] },
];

export default function TelaResultadoRelatorioUniformes() {
    const { dataInicio, dataFim } = useLocalSearchParams<{ dataInicio: string, dataFim: string }>();
    const [relatorio, setRelatorio] = useState<RelatorioItem[]>([])
    const [loading, setLoading] = useState(true)
    const [textoPesquisa, setTextoPesquisa] = useState('')
    const [filtroCategoria, setFiltroCategoria] = useState<string | string[]>('Todos')

    useEffect(() => {
        if (!dataInicio || !dataFim) return;

        const carregarRelatorio = async () => {
            setLoading(true);
            const vendas = await fetchVendasUniformesPorPeriodo(dataInicio, dataFim);
            
            const agrupado = vendas.reduce((acc, venda) => {
                const id = venda.Uniformes.id_uniforme;
                if (!acc[id]) {
                    acc[id] = {
                        id: id,
                        Nome: venda.Uniformes.Nome,
                        Img: venda.Uniformes.Img,
                        Categoria: venda.Uniformes.Categoria,
                        precoBase: venda.Uniformes.Preço,
                        totalVendas: 0,
                    };
                }
                acc[id].totalVendas += venda.Preco_total;
                return acc;
            }, {});

            setRelatorio(Object.values(agrupado));
            setLoading(false);
        };
        carregarRelatorio();
    }, [dataInicio, dataFim]);

    const valorTotalArrecadado = useMemo(() => {
        return relatorio.reduce((soma, item) => soma + item.totalVendas, 0);
    }, [relatorio]);
    
    const relatorioFiltrado = useMemo(() => {
        return relatorio
            .filter(item => {
                if (filtroCategoria === 'Todos') return true;
                if (Array.isArray(filtroCategoria)) {
                    return filtroCategoria.some(cat => item.Categoria?.toLowerCase() === cat.toLowerCase());
                }
                return item.Categoria?.toLowerCase() === filtroCategoria.toLowerCase();
            })
            .filter(item => {
                return item.Nome.toLowerCase().includes(textoPesquisa.toLowerCase());
            });
    }, [relatorio, textoPesquisa, filtroCategoria]);
    
    const formatarData = (dataString: string) => new Date(dataString).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

    const renderCard = ({ item }: { item: RelatorioItem }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.Img }} style={styles.cardImage} />
            <Link href={{
                pathname: "/relatorio-vendas/uniformes-detalhe",
                params: {
                    id_uniforme: item.id,
                    nome: item.Nome,
                    img: item.Img,
                    precoBase: item.precoBase,
                    dataInicio,
                    dataFim
                }
            }} asChild>
                <TouchableOpacity style={styles.infoButton}>
                    <FontAwesome5 name="info-circle" size={24} color="#FFF" />
                </TouchableOpacity>
            </Link>
            <Text style={styles.cardTitle}>{item.Nome}</Text>
            <Text style={styles.cardValue}>Valor total de vendas: {item.totalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
        </View>
    );

    if (loading) {
        return <SafeAreaView style={styles.safeArea}><View style={styles.loadingContainer}><ActivityIndicator size="large" color="#5C8E8B" /></View></SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={[styles.circle, styles.circleOne]} /><View style={[styles.circle, styles.circleTwo]} /><View style={[styles.circle, styles.circleThree]} /><View style={[styles.circle, styles.circleFour]} />
            <View style={styles.header}>
                <Link href="/relatorio-vendas" asChild><TouchableOpacity style={styles.backButton}><FontAwesome5 name="arrow-left" size={24} color="#333" /></TouchableOpacity></Link>
                <Image source={UniformeIcon} style={styles.headerIcon} />
                <Text style={styles.headerTitle}>Relatório de Uniformes</Text>
            </View>
            <View style={styles.searchContainer}><TextInput style={styles.searchInput} placeholder="Pesquise aqui..." placeholderTextColor="#888" value={textoPesquisa} onChangeText={setTextoPesquisa}/><FontAwesome name="search" size={20} color="#888" style={styles.searchIcon} /></View>
            <View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>{categorias.map(c => (<TouchableOpacity key={c.label} style={[styles.categoryButton, filtroCategoria === c.value && styles.categoryButtonActive]} onPress={() => setFiltroCategoria(c.value)}><Text style={[styles.categoryButtonText, filtroCategoria === c.value && styles.categoryButtonTextActive]}>{c.label}</Text></TouchableOpacity>))}</ScrollView></View>
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>Conferindo de: {formatarData(dataInicio)} até {formatarData(dataFim)}</Text>
                <Text style={styles.summaryText}>Valor total arrecadado: {valorTotalArrecadado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
            </View>
            <FlatList
                data={relatorioFiltrado}
                renderItem={renderCard}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F4F1E9' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F1E9' },
    circle: { position: 'absolute', opacity: 0.7, zIndex: -1 },
    circleOne: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#D9A583', top: -50, left: -80 },
    circleTwo: { width: 300, height: 300, borderRadius: 150, backgroundColor: '#9FB5A8', top: 100, right: -120 },
    circleThree: { width: 250, height: 250, borderRadius: 125, backgroundColor: '#8C5F54', bottom: 130, left: -100 },
    circleFour: { width: 350, height: 350, borderRadius: 175, backgroundColor: '#D9C47E', bottom: -130, right: -100 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
    backButton: { marginRight: 15, padding: 5 },
    headerIcon: { width: 35, height: 35, marginRight: 10 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 15, marginHorizontal: 20, paddingHorizontal: 15, paddingVertical: 10, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
    searchInput: { flex: 1, fontSize: 16, color: '#333' },
    searchIcon: { marginLeft: 10 },
    categoryContainer: { paddingHorizontal: 20, paddingVertical: 10 },
    categoryButton: { paddingVertical: 8, paddingHorizontal: 20, backgroundColor: '#FFF', borderRadius: 20, marginRight: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
    categoryButtonActive: { backgroundColor: '#5C8E8B' },
    categoryButtonText: { fontSize: 14, fontWeight: '500', color: '#555' },
    categoryButtonTextActive: { color: '#FFF' },
    summaryContainer: { marginHorizontal: 20, marginBottom: 10, padding: 10, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 10 },
    summaryText: { fontSize: 15, fontWeight: '500', color: '#333', textAlign: 'center' },
    listContainer: { paddingHorizontal: 20 },
    card: { backgroundColor: '#FFF', borderRadius: 15, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, overflow: 'hidden' },
    cardImage: { width: '100%', height: 150, resizeMode: 'contain', backgroundColor: '#F8F8F8' },
    infoButton: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
    cardTitle: { fontSize: 18, fontWeight: '600', color: '#333', textAlign: 'center', marginTop: 10 },
    cardValue: { fontSize: 16, color: '#555', textAlign: 'center', marginVertical: 10 },
});