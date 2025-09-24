import {
    checkIfVendaHasUniformes,
    deletePedido,
    fetchDetalhesPedidosArmario,
    fetchDetalhesPedidosUniforme,
    fetchPedido,
    updateCompraFinalizada,
    updateStatusPagamento
} from '@/lib/fetchPedidos'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ReciboIcon = require('../../assets/icons/recibo.png')

interface Pedido {
    id_venda: number;
    Data: string;
    Forma_de_pagamento: string;
    Total: number;
    Pago: boolean;
    Retirado: boolean;
    Compra_finalizada: boolean;
    Clientes: { Nome: string };
}
interface ItemUniformeRaw {
    id: number;
    Qtd: number;
    Preco_total: number;
    Uniformes: { Nome: string };
    Estoque_uniforme: { Tamanho: string };
}
interface ItemArmarioRaw {
    id: number;
    N_armario: number;
    Armários: { preco_final: number };
}
interface ItemPedidoUnificado {
    id: string;
    nome: string;
    detalhe: string;
    preco: number;
    quantidade?: number;
}

export default function DetalhesPedidoScreen() {
    const { id } = useLocalSearchParams()
    const vendaId = Number(id)
    const router = useRouter()

    const [pedido, setPedido] = useState<Pedido | null>(null)
    const [itensPedido, setItensPedido] = useState<ItemPedidoUnificado[]>([])
    const [loading, setLoading] = useState(true)

    const [statusPago, setStatusPago] = useState(false)
    const [statusRetirado, setStatusRetirado] = useState(false)
    const [hasUniformes, setHasUniformes] = useState(false)
    const [statusFinalizado, setStatusFinalizado] = useState(false)

    const carregarDetalhes = async () => {
        if (!vendaId) return;
        try {
            setLoading(true);
            const [pedidoData, uniformesData, armariosData, uniformesCheck] = await Promise.all([
                fetchPedido(vendaId),
                fetchDetalhesPedidosUniforme(vendaId),
                fetchDetalhesPedidosArmario(vendaId),
                checkIfVendaHasUniformes(vendaId)
            ])

            if (pedidoData && pedidoData.length > 0) {
                const p = pedidoData[0]
                setPedido(p)
                setStatusPago(p.Pago)
                setStatusRetirado(p.Retirado)
                setStatusFinalizado(p.Compra_finalizada)
            }

            setHasUniformes(uniformesCheck)

            const itensUniformes = (uniformesData as ItemUniformeRaw[] || []).map(item => ({ id: `uniforme-${item.id}`, nome: item.Uniformes.Nome, detalhe: item.Estoque_uniforme?.Tamanho || '-', preco: item.Preco_total, quantidade: item.Qtd }));
            const itensArmarios = (armariosData as ItemArmarioRaw[] || []).map(item => ({ id: `armario-${item.id}`, nome: 'Armário', detalhe: `Nº ${item.N_armario}`, preco: item.Armários.preco_final }));
            setItensPedido([...itensUniformes, ...itensArmarios]);
        } catch (error) {
            console.error("Erro ao carregar detalhes do pedido:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarDetalhes()
    }, [vendaId])

    const handleSalvarPagamento = async () => {
        if (!pedido) return
        const { error } = await updateStatusPagamento(pedido.id_venda, statusPago)
        if (error) {
            Alert.alert("Erro", "Não foi possível salvar o status de pagamento.")
            return
        }

        const eFinalizado = hasUniformes ? (statusPago && statusRetirado) : statusPago
        await updateCompraFinalizada(pedido.id_venda, eFinalizado)

        Alert.alert("Sucesso", "Status de pagamento salvo!")
        await carregarDetalhes()
    }

    const handleSalvarRetirada = async () => {
        if (!pedido) return

        const eFinalizado = statusPago && statusRetirado
        await updateCompraFinalizada(pedido.id_venda, eFinalizado)

        Alert.alert("Sucesso", "Status de retirada salvo!")
        await carregarDetalhes()
    }

    const handleDelete = () => {
        if (!pedido) return;
        Alert.alert(
            "Confirmar Exclusão",
            `Tem certeza que deseja deletar o pedido de ${pedido.Clientes.Nome}? Esta ação não pode ser desfeita.`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Deletar",
                    style: "destructive",
                    onPress: async () => {
                        const { error } = await deletePedido(pedido.id_venda);
                        if (error) {
                            Alert.alert("Erro", "Não foi possível deletar o pedido.");
                        } else {
                            Alert.alert("Sucesso", "Pedido deletado com sucesso.");
                            router.back();
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return <SafeAreaView style={styles.safeArea}><View style={styles.loadingContainer}><ActivityIndicator size="large" color="#5C8E8B" /></View></SafeAreaView>;
    }

    if (!pedido) {
        return <SafeAreaView style={styles.safeArea}><View style={styles.loadingContainer}><Text style={styles.headerTitle}>Pedido não encontrado</Text></View></SafeAreaView>;
    }

    const renderItem = ({ item }: { item: ItemPedidoUnificado }) => (
        <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellIndex]}>{item.quantidade || ''}</Text>
            <Text style={[styles.tableCell, styles.tableCellDesc]}>{item.nome}</Text>
            <Text style={[styles.tableCell, styles.tableCellSize]}>{item.detalhe}</Text>
            <Text style={[styles.tableCell, styles.tableCellPrice]}>{item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={[styles.circle, styles.circleOne]} />
            <View style={[styles.circle, styles.circleTwo]} />
            <View style={[styles.circle, styles.circleThree]} />
            <View style={[styles.circle, styles.circleFour]} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Link href="/pedidos" style={styles.backButton}><FontAwesome5 name="arrow-left" size={24} color="#333" /></Link>
                        <FontAwesome5 name="clipboard-list" size={30} color="#333" style={styles.headerIcon} />
                        <Text style={styles.headerTitle}>Pedidos</Text>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <FontAwesome5 name="trash-alt" size={22} color="#E53935" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.clientName}>{pedido.Clientes.Nome}</Text>
                    <View style={styles.table}><FlatList data={itensPedido} renderItem={renderItem} keyExtractor={(item) => item.id} scrollEnabled={false} /></View>

                    <View style={styles.section}>
                        <View>
                            <Text style={styles.sectionTitle}>Pagamento:</Text>
                            <TouchableOpacity style={styles.radioOption} onPress={() => setStatusPago(true)}>
                                <FontAwesome name={statusPago ? 'check-circle' : 'circle-thin'} size={20} color={statusPago ? '#5C8E8B' : '#888'} />
                                <Text style={styles.radioText}>Pago</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.radioOption} onPress={() => setStatusPago(false)}>
                                <FontAwesome name={!statusPago ? 'check-circle' : 'circle-thin'} size={20} color={!statusPago ? '#5C8E8B' : '#888'} />
                                <Text style={styles.radioText}>Não pago</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={handleSalvarPagamento}>
                            <FontAwesome5 name="save" size={32} color="#5C8E8B" />
                        </TouchableOpacity>
                    </View>

                    {hasUniformes && (
                        <View style={styles.section}>
                            <View>
                                <Text style={styles.sectionTitle}>Retirada:</Text>
                                <TouchableOpacity style={styles.radioOption} onPress={() => setStatusRetirado(true)}>
                                    <FontAwesome name={statusRetirado ? 'check-circle' : 'circle-thin'} size={20} color={statusRetirado ? '#5C8E8B' : '#888'} />
                                    <Text style={styles.radioText}>Retirou</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.radioOption} onPress={() => setStatusRetirado(false)}>
                                    <FontAwesome name={!statusRetirado ? 'check-circle' : 'circle-thin'} size={20} color={!statusRetirado ? '#5C8E8B' : '#888'} />
                                    <Text style={styles.radioText}>Ainda não retirou</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={handleSalvarRetirada}>
                                <FontAwesome5 name="save" size={32} color="#5C8E8B" />
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.footer}>
                        <View>
                            <Text style={styles.footerLabel}>Forma de pagamento:</Text>
                            <Text style={styles.footerValue}>{pedido.Forma_de_pagamento}</Text>
                        </View>
                        <Image source={ReciboIcon} style={styles.reciboIcon} />
                        <View style={styles.totalSection}>
                            <Text style={styles.footerLabel}>Total</Text>
                            <Text style={styles.totalValue}>{pedido.Total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F4F1E9' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F1E9' },
    scrollContainer: { padding: 20 },
    card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, },
    backButton: { marginRight: 15, padding: 5 },
    deleteButton: { padding: 5 },
    headerIcon: { marginRight: 10 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    clientName: { fontSize: 22, fontWeight: '600', textAlign: 'center', color: '#333', paddingVertical: 15, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#EEE', marginBottom: 15 },
    table: { marginBottom: 20 },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#F0F0F0', paddingVertical: 12 },
    tableCell: { fontSize: 16, color: '#444' },
    tableCellIndex: { flex: 0.1, textAlign: 'center' },
    tableCellDesc: { flex: 0.5 },
    tableCellSize: { flex: 0.2, textAlign: 'center' },
    tableCellPrice: { flex: 0.25, textAlign: 'right', fontWeight: '500' },
    section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderTopWidth: 1, borderColor: '#EEE' },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 10 },
    radioOption: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    radioText: { fontSize: 16, marginLeft: 10, color: '#555' },
    footer: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderColor: '#EEE', paddingTop: 15, marginTop: 10 },
    footerLabel: { fontSize: 14, color: '#666' },
    footerValue: { fontSize: 18, fontWeight: '500', color: '#333' },
    totalSection: { marginLeft: 'auto', alignItems: 'flex-end' },
    totalValue: { fontSize: 22, fontWeight: 'bold', color: '#5C8E8B' },
    circle: { position: 'absolute', opacity: 0.7, zIndex: -1 },
    circleOne: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#D9A583', top: -50, left: -80 },
    circleTwo: { width: 300, height: 300, borderRadius: 150, backgroundColor: '#9FB5A8', top: 100, right: -120 },
    circleThree: { width: 250, height: 250, borderRadius: 125, backgroundColor: '#8C5454', bottom: -80, left: -100 },
    circleFour: { width: 350, height: 350, borderRadius: 175, backgroundColor: '#D9C47E', bottom: -150, right: -100 },
    reciboIcon: { width: 40, height: 40, marginRight: 10, marginLeft: 20, resizeMode: 'contain' },
});