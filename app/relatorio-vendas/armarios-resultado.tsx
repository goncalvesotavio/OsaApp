import { fetchVendasArmariosPorPeriodo } from '@/lib/fetchFinanceiro';
import { FontAwesome5 } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ArmarioIcon = require('../../assets/icons/armarios gestao.png');

interface VendaArmario {
    N_armario: number;
    Armários: { preco: number };
}

export default function TelaResultadoRelatorioArmarios() {
    const { dataInicio, dataFim } = useLocalSearchParams<{ dataInicio: string, dataFim: string }>();
    const [vendas, setVendas] = useState<VendaArmario[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!dataInicio || !dataFim) return;

        const carregarRelatorio = async () => {
            setLoading(true);
            const vendasData = await fetchVendasArmariosPorPeriodo(dataInicio, dataFim);
            setVendas(vendasData);
            setLoading(false);
        };
        carregarRelatorio();
    }, [dataInicio, dataFim]);

    const valorTotalArrecadado = useMemo(() => {
        return vendas.reduce((soma, item) => soma + item.Armários.preco, 0);
    }, [vendas]);

    const formatarData = (dataString: string) => new Date(dataString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    const renderVendaItem = ({ item }) => (
        <View style={styles.itemRow}>
            <Text style={styles.itemText}>Armário Nº {item.N_armario}</Text>
            <Text style={styles.itemValue}>{item.Armários.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
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
                <Image source={ArmarioIcon} style={styles.headerIcon} />
                <Text style={styles.headerTitle}>Relatório de Armários</Text>
            </View>

            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>Conferindo de: {formatarData(dataInicio)} até {formatarData(dataFim)}</Text>
                <Text style={styles.summaryTextBold}>Valor total arrecadado: {valorTotalArrecadado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
            </View>

            <FlatList
                data={vendas}
                renderItem={renderVendaItem}
                keyExtractor={(item, index) => `${item.N_armario}-${index}`}
                contentContainerStyle={styles.listContainer}
                ListHeaderComponent={<Text style={styles.listHeader}>Armários Alugados no Período</Text>}
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
    headerIcon: { width: 35, height: 35, marginRight: 10 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    summaryContainer: { margin: 20, padding: 15, backgroundColor: '#FFFFFF', borderRadius: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
    summaryText: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 5 },
    summaryTextBold: { fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center', marginTop: 5 },
    listContainer: { paddingHorizontal: 20 },
    listHeader: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 15, marginTop: 10, textAlign: 'center' },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
    itemText: { fontSize: 16, color: '#444' },
    itemValue: { fontSize: 16, fontWeight: '500', color: '#333' },
});