import { fetchVendasDeUmUniformePorPeriodo } from '@/lib/fetchFinanceiro';
import { FontAwesome5 } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const UniformeIcon = require('../../assets/icons/uniformes gestao.png');

interface VendaDetalhe {
    tamanho: string;
    quantidade: number;
    valorTotal: number;
}

export default function TelaDetalheRelatorioUniforme() {
    const params = useLocalSearchParams<{ id_uniforme: string, nome: string, img: string, precoBase: string, dataInicio: string, dataFim: string }>();
    const { id_uniforme, nome, img, precoBase, dataInicio, dataFim } = params;

    const [detalhesVenda, setDetalhesVenda] = useState<VendaDetalhe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id_uniforme || !dataInicio || !dataFim) return;

        const carregarDetalhes = async () => {
            setLoading(true);
            const vendas = await fetchVendasDeUmUniformePorPeriodo(Number(id_uniforme), dataInicio, dataFim);

            const agrupadoPorTamanho = vendas.reduce((acc, venda) => {
                const tamanho = venda.Estoque_uniforme?.Tamanho || 'N/A';
                if (!acc[tamanho]) {
                    acc[tamanho] = { tamanho: tamanho, quantidade: 0, valorTotal: 0 };
                }
                acc[tamanho].quantidade += venda.Qtd;
                acc[tamanho].valorTotal += venda.Preco_total;
                return acc;
            }, {});

            setDetalhesVenda(Object.values(agrupadoPorTamanho));
            setLoading(false);
        };
        carregarDetalhes();
    }, [id_uniforme, dataInicio, dataFim]);

    const valorTotalGeral = useMemo(() => {
        return detalhesVenda.reduce((soma, item) => soma + item.valorTotal, 0);
    }, [detalhesVenda]);

    if (loading) {
        return <SafeAreaView style={styles.safeArea}><View style={styles.loadingContainer}><ActivityIndicator size="large" color="#5C8E8B" /></View></SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={[styles.circle, styles.circleOne]} /><View style={[styles.circle, styles.circleTwo]} /><View style={[styles.circle, styles.circleThree]} /><View style={[styles.circle, styles.circleFour]} />
            
            <View style={styles.header}>
                <Link href={{ pathname: "/relatorio-vendas/uniformes-resultado", params: { dataInicio, dataFim } }} asChild>
                    <TouchableOpacity style={styles.backButton}>
                        <FontAwesome5 name="arrow-left" size={24} color="#333" />
                    </TouchableOpacity>
                </Link>
                <Image source={UniformeIcon} style={styles.headerIcon} />
                <Text style={styles.headerTitle}>Estoque de Uniformes</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: img }} style={styles.mainImage} />
                    </View>
                    <Text style={styles.uniformeTitle}>{nome}</Text>
                    <Text style={styles.uniformePrice}>{Number(precoBase).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>

                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderText, {flex: 0.3}]}>Tamanho</Text>
                            <Text style={[styles.tableHeaderText, {flex: 0.3, textAlign: 'center'}]}>Quantidade</Text>
                            <Text style={[styles.tableHeaderText, {flex: 0.4, textAlign: 'right'}]}>Valor Total</Text>
                        </View>
                        {detalhesVenda.map(item => (
                            <View key={item.tamanho} style={styles.tableRow}>
                                <Text style={[styles.tableCell, {flex: 0.3}]}>{item.tamanho}</Text>
                                <Text style={[styles.tableCell, {flex: 0.3, textAlign: 'center'}]}>{item.quantidade}</Text>
                                <Text style={[styles.tableCell, {flex: 0.4, textAlign: 'right'}]}>{item.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Valor total : {valorTotalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F4F1E9' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    circle: { position: 'absolute', opacity: 0.7, zIndex: -1 },
    circleOne: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#D9A583', top: -50, left: -80 },
    circleTwo: { width: 300, height: 300, borderRadius: 150, backgroundColor: '#9FB5A8', top: 100, right: -120 },
    circleThree: { width: 250, height: 250, borderRadius: 125, backgroundColor: '#8C5F54', bottom: 130, left: -100 },
    circleFour: { width: 350, height: 350, borderRadius: 175, backgroundColor: '#D9C47E', bottom: -130, right: -100 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
    backButton: { marginRight: 15, padding: 5 },
    headerIcon: { width: 35, height: 35, marginRight: 10 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    scrollContainer: { padding: 20, paddingBottom: 40 },
    card: { backgroundColor: '#FFF', borderRadius: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
    imageContainer: { backgroundColor: '#F0F0F0', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 15, alignItems: 'center' },
    mainImage: { width: '80%', height: 200, resizeMode: 'contain' },
    uniformeTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginTop: 15 },
    uniformePrice: { fontSize: 18, color: '#555', textAlign: 'center', marginBottom: 20 },
    table: { paddingHorizontal: 20, marginBottom: 20 },
    tableHeader: { flexDirection: 'row', borderBottomWidth: 2, borderColor: '#333', paddingBottom: 10, marginBottom: 10 },
    tableHeaderText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#EEE' },
    tableCell: { fontSize: 16, color: '#444' },
    footer: { borderTopWidth: 2, borderColor: '#333', paddingTop: 15, marginTop: 10, marginHorizontal: 20, paddingBottom: 15, alignItems: 'flex-end' },
    footerText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
});