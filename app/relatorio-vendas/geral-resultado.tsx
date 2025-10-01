import { fetchVendasArmariosPorPeriodo, fetchVendasUniformesPorPeriodo } from '@/lib/fetchFinanceiro';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const UniformeIcon = require('../../assets/icons/uniformes gestao.png');
const ArmarioIcon = require('../../assets/icons/armarios gestao.png');

interface RelatorioGeralItem {
    id: string;
    data: string;
    tipo: 'uniforme' | 'armario';
    descricao: string;
    valor: number;
}

export default function TelaResultadoRelatorioGeral() {
    const { dataInicio, dataFim } = useLocalSearchParams<{ dataInicio: string, dataFim: string }>();
    const [itensRelatorio, setItensRelatorio] = useState<RelatorioGeralItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!dataInicio || !dataFim) return;

        const carregarRelatorio = async () => {
            setLoading(true);
            const [vendasUniformes, vendasArmarios] = await Promise.all([
                fetchVendasUniformesPorPeriodo(dataInicio, dataFim),
                fetchVendasArmariosPorPeriodo(dataInicio, dataFim)
            ]);

            const itensUniformes = vendasUniformes.map(v => ({
                id: `u-${v.id}`,
                data: v['Vendas-2025'].Data,
                tipo: 'uniforme' as const,
                descricao: v.Uniformes.Nome,
                valor: v.Preco_total
            }));

            const itensArmarios = vendasArmarios.map(v => ({
                id: `a-${v.id}`,
                data: v['Vendas-2025'].Data,
                tipo: 'armario' as const,
                descricao: `Armário Nº ${v.N_armario}`,
                valor: v.Armários.preco
            }));
            
            const todosOsItens = [...itensUniformes, ...itensArmarios];
            todosOsItens.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

            setItensRelatorio(todosOsItens);
            setLoading(false);
        };
        carregarRelatorio();
    }, [dataInicio, dataFim]);

    const valorTotalArrecadado = useMemo(() => {
        return itensRelatorio.reduce((soma, item) => soma + item.valor, 0);
    }, [itensRelatorio]);

    const formatarData = (dataString: string) => new Date(dataString).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

    const renderVendaItem = ({ item }) => {
        const iconSource = item.tipo === 'uniforme' ? UniformeIcon : ArmarioIcon;
        return (
            <View style={styles.itemRow}>
                <Image source={iconSource} style={styles.itemIcon} />
                <View style={styles.itemDetails}>
                    <Text style={styles.itemText}>{item.descricao}</Text>
                    <Text style={styles.itemDate}>{formatarData(item.data)}</Text>
                </View>
                <Text style={styles.itemValue}>{item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
            </View>
        );
    };

    if (loading) {
        return <SafeAreaView style={styles.safeArea}><View style={styles.loadingContainer}><ActivityIndicator size="large" color="#5C8E8B" /></View></SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={[styles.circle, styles.circleOne]} /><View style={[styles.circle, styles.circleTwo]} /><View style={[styles.circle, styles.circleThree]} /><View style={[styles.circle, styles.circleFour]} />
            
            <View style={styles.header}>
                <Link href="/relatorio-vendas" asChild><TouchableOpacity style={styles.backButton}><FontAwesome5 name="arrow-left" size={24} color="#333" /></TouchableOpacity></Link>
                <Feather name="dollar-sign" size={30} color="#333" style={styles.headerIcon} />
                <Text style={styles.headerTitle}>Relatório Geral</Text>
            </View>

            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>Conferindo de: {formatarData(dataInicio)} até {formatarData(dataFim)}</Text>
                <Text style={styles.summaryTextBold}>Valor total arrecadado: {valorTotalArrecadado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
            </View>

            <FlatList
                data={itensRelatorio}
                renderItem={renderVendaItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                ListHeaderComponent={<Text style={styles.listHeader}>Todas as Transações no Período</Text>}
            />
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
    headerIcon: { marginRight: 10 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    summaryContainer: { margin: 20, padding: 15, backgroundColor: '#FFFFFF', borderRadius: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
    summaryText: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 5 },
    summaryTextBold: { fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center', marginTop: 5 },
    listContainer: { paddingHorizontal: 20 },
    listHeader: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 15, marginTop: 10, textAlign: 'center' },
    itemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
    itemIcon: { width: 30, height: 30, marginRight: 15, resizeMode: 'contain' },
    itemDetails: { flex: 1 },
    itemText: { fontSize: 16, color: '#444', fontWeight: '500' },
    itemDate: { fontSize: 12, color: '#888' },
    itemValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
});