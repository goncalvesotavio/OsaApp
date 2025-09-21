import { buscarArmario, buscarClienteArmario, fetchVendaPorId } from '@/lib/fetchArmarios';
import { FontAwesome5 } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ArmarioIcon = require('../../../assets/icons/armarios gestao.png');
const ContratoIcon = require('../../../assets/icons/relatorio.png');

interface Armario {
    N_armario: number;
    Corredor: string;
    Disponivel: boolean;
    Funcional: boolean;
    Vendas_armários: { id_venda: number }[];
}
interface Cliente {
    Nome: string;
    RM: string;
    Tipo_curso: string;
    Curso: string;
    Serie: string;
}
interface Venda {
    Data: string;
}

export default function TelaDetalheArmario() {
    const { n_armario } = useLocalSearchParams();
    const [armario, setArmario] = useState<Armario | null>(null);
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [venda, setVenda] = useState<Venda | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const carregarDetalhes = async () => {
            if (!n_armario) return;
            setLoading(true);
            const numeroArmario = Number(n_armario);
            
            const armarioDataArray = await buscarArmario(numeroArmario);
            if (armarioDataArray && armarioDataArray.length > 0) {
                const armarioAtual = armarioDataArray[0];
                setArmario(armarioAtual);

                const isOcupado = !armarioAtual.Disponivel && armarioAtual.Vendas_armários && armarioAtual.Vendas_armários.length > 0;
                
                if (isOcupado) {
                    const idVenda = armarioAtual.Vendas_armários[0].id_venda;
                    const [clienteDataArray, vendaData] = await Promise.all([
                        buscarClienteArmario(idVenda),
                        fetchVendaPorId(idVenda)
                    ]);

                    if (clienteDataArray && clienteDataArray.length > 0 && clienteDataArray[0].Clientes) {
                        setCliente(clienteDataArray[0].Clientes);
                    }
                    if (vendaData) {
                        setVenda(vendaData);
                    }
                }
            }
            setLoading(false);
        };
        carregarDetalhes();
    }, [n_armario]);

    const getStatusStyle = () => {
        if (armario?.Funcional === false) { return styles.statusDotRed; }
        if (armario?.Disponivel) { return styles.statusDotGreen; }
        return styles.statusDotGray;
    };

    const formatarData = (dataString) => {
        if (!dataString) return "N/A";
        const data = new Date(dataString);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };
    
    const calcularVencimento = (dataString) => {
        if (!dataString) return "N/A";
        const data = new Date(dataString);
        data.setFullYear(data.getFullYear() + 1);
        return formatarData(data);
    };

    const DetalheItem = ({ label, value }) => (
        <View style={styles.detalheRow}>
            <Text style={styles.detalheLabel}>{label}</Text>
            <Text style={styles.detalheValue}>{value}</Text>
        </View>
    );

    const renderDetalhes = () => {
        if (armario?.Funcional === false) {
            return <Text style={styles.infoText}>Este armário está quebrado.</Text>;
        }
        if (armario?.Disponivel) {
            return <Text style={styles.infoText}>Este armário não está alugado.</Text>;
        }
        if (cliente) {
            return (
                <View>
                    <DetalheItem label="Ocupado por:" value={cliente.Nome} />
                    <DetalheItem label="RM:" value={cliente.RM} />
                    <DetalheItem label="Curso:" value={cliente.Curso} />
                    <DetalheItem label="Série:" value={cliente.Serie} />
                    <DetalheItem label="Data de compra:" value={formatarData(venda?.Data)} />
                    <DetalheItem label="Vencimento de contrato:" value={calcularVencimento(venda?.Data)} />
                    <View style={styles.contratoContainer}>
                        <Text style={styles.detalheLabel}>Visualize o contrato:</Text>
                        <TouchableOpacity><Image source={ContratoIcon} style={styles.contratoIcon} /></TouchableOpacity>
                    </View>
                </View>
            );
        }
        return <Text style={styles.infoText}>Carregando informações do locatário...</Text>;
    };

    if (loading) {
        return <SafeAreaView style={styles.safeArea}><View style={styles.loadingContainer}><ActivityIndicator size="large" color="#5C8E8B" /></View></SafeAreaView>;
    }

    if (!armario) {
        return <SafeAreaView style={styles.safeArea}><View style={styles.loadingContainer}><Text>Armário não encontrado.</Text></View></SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={[styles.circle, styles.circleOne]} />
            <View style={[styles.circle, styles.circleTwo]} />
            <View style={[styles.circle, styles.circleThree]} />
            <View style={[styles.circle, styles.circleFour]} />

            <View style={styles.header}>
                <Link href={`/estoque-armarios/${armario.Corredor}`} asChild><TouchableOpacity style={styles.backButton}><FontAwesome5 name="arrow-left" size={24} color="#333" /></TouchableOpacity></Link>
                <Image source={ArmarioIcon} style={styles.headerIcon} />
                <Text style={styles.headerTitle}>Estoque de Armários</Text>
            </View>
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.numeroContainer}><Text style={styles.numeroTexto}>{armario.N_armario}</Text></View>
                        <View style={styles.headerInfo}>
                            <Text style={styles.corredorTexto}>Corredor {armario.Corredor}</Text>
                            <View style={styles.statusContainer}>
                                <Text style={styles.statusTexto}>Status:</Text>
                                <View style={[styles.statusDot, getStatusStyle()]} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detalhesContainer}>
                        <Text style={styles.detalhesTitle}>Detalhes</Text>
                        {renderDetalhes()}
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
    scrollContainer: { padding: 20 },
    card: { backgroundColor: '#FFFFFF', borderRadius: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
    cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    numeroContainer: { width: 80, height: 80, borderWidth: 3, borderColor: '#333', justifyContent: 'center', alignItems: 'center', marginRight: 20 },
    numeroTexto: { fontSize: 36, fontWeight: 'bold', color: '#333' },
    headerInfo: { flex: 1 },
    corredorTexto: { fontSize: 18, fontWeight: '500', color: '#555' },
    statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    statusTexto: { fontSize: 18, fontWeight: '500', color: '#555', marginRight: 10 },
    statusDot: { width: 20, height: 20, borderRadius: 10 },
    statusDotGreen: { backgroundColor: '#4CAF50' },
    statusDotGray: { backgroundColor: '#9E9E9E' },
    statusDotRed: { backgroundColor: '#F44336' },
    divider: { height: 1, backgroundColor: '#EEE', marginHorizontal: 20 },
    detalhesContainer: { padding: 20 },
    detalhesTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 20, textAlign: 'center' },
    infoText: { fontSize: 18, color: '#666', textAlign: 'center', paddingVertical: 20 },
    detalheRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    detalheLabel: { fontSize: 16, color: '#333', fontWeight: 'bold' },
    detalheValue: { fontSize: 16, color: '#555', flex: 1, textAlign: 'right' },
    contratoContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
    contratoIcon: { width: 35, height: 35, resizeMode: 'contain' },
});