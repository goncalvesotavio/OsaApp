import { atualizarEstoque, buscarUniforme, detalhesEstoque } from '@/lib/fetchUniformes'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { Link, Stack, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const UniformeIcon = require('../../assets/icons/uniformes gestao.png');

interface Uniforme {
    id_uniforme: number;
    Nome: string;
    Img: string;
}
interface Estoque {
    id_estoque: number;
    Tamanho: string;
    Qtd_estoque: number;
}

export default function DetalheEstoqueScreen() {
    const { id } = useLocalSearchParams();
    const uniformeId = Number(id);

    const [uniforme, setUniforme] = useState<Uniforme | null>(null);
    const [estoques, setEstoques] = useState<Estoque[]>([]);
    const [loading, setLoading] = useState(true);

    const [tamanhoSelecionado, setTamanhoSelecionado] = useState<Estoque | null>(null);
    const [valorMudanca, setValorMudanca] = useState('');

    const carregarDetalhes = async () => {
        if (!uniformeId) return;
        setLoading(true);
        const [uniformeData, estoqueData] = await Promise.all([
            buscarUniforme(uniformeId),
            detalhesEstoque(uniformeId)
        ]);
        if (uniformeData && uniformeData.length > 0) {
            setUniforme(uniformeData[0]);
        }
        setEstoques(estoqueData);
        setTamanhoSelecionado(null);
        setValorMudanca('');
        setLoading(false);
    };

    useEffect(() => {
        carregarDetalhes();
    }, [uniformeId]);

    const estoqueTotal = useMemo(() => {
        return estoques.reduce((soma, item) => soma + item.Qtd_estoque, 0);
    }, [estoques]);

    const handleSalvarEstoque = async () => {
        if (!tamanhoSelecionado) {
            Alert.alert("Atenção", "Por favor, selecione um tamanho antes de salvar.");
            return;
        }

        const mudancaNumerica = parseInt(valorMudanca, 10);

        if (isNaN(mudancaNumerica) || mudancaNumerica === 0) {
            Alert.alert("Atenção", "Por favor, insira um valor válido (diferente de zero) para adicionar ou remover.");
            return;
        }

        const novaQuantidade = tamanhoSelecionado.Qtd_estoque + mudancaNumerica;
        if (novaQuantidade < 0) {
            Alert.alert("Erro", "A quantidade em estoque não pode ser negativa.");
            return;
        }

        await atualizarEstoque(tamanhoSelecionado.id_estoque, novaQuantidade);
        Alert.alert("Sucesso", `Estoque do tamanho ${tamanhoSelecionado.Tamanho} atualizado!`);
        await carregarDetalhes();
    };

    const alterarValor = (quantidade: number) => {
        const valorAtual = parseInt(valorMudanca, 10) || 0;
        const novoValor = valorAtual + quantidade;
        setValorMudanca(novoValor.toString());
    };

    if (loading) {
        return <SafeAreaView style={styles.safeArea}><View style={styles.loadingContainer}><ActivityIndicator size="large" color="#5C8E8B" /></View></SafeAreaView>;
    }

    if (!uniforme) {
        return <SafeAreaView style={styles.safeArea}><View style={styles.loadingContainer}><Text>Uniforme não encontrado.</Text></View></SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <Stack.Screen options={{ headerShown: false }} />
                <View style={[styles.circle, styles.circleOne]} />
                <View style={[styles.circle, styles.circleTwo]} />
                <View style={[styles.circle, styles.circleThree]} />
                <View style={[styles.circle, styles.circleFour]} />

                <View style={styles.header}>
                    <Link href="/estoque-uniformes" asChild><TouchableOpacity style={styles.backButton}><FontAwesome5 name="arrow-left" size={24} color="#333" /></TouchableOpacity></Link>
                    <Image source={UniformeIcon} style={styles.headerIcon} />
                    <Text style={styles.headerTitle}>Estoque de Uniformes</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.card}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: uniforme.Img }} style={styles.mainImage} />
                        </View>
                        <Text style={styles.uniformeTitle}>{uniforme.Nome}</Text>

                        <View style={styles.estoqueContainer}>
                            <View style={styles.estoqueList}>
                                {estoques.map(item => (
                                    <Text key={item.id_estoque} style={styles.estoqueItem}>
                                        {item.Tamanho} : {item.Qtd_estoque}
                                    </Text>
                                ))}
                            </View>
                            <Text style={styles.estoqueTotal}>Total : {estoqueTotal}</Text>
                        </View>

                        <View style={styles.actionsContainer}>
                            <Text style={styles.actionsTitle}>Selecione o tamanho que deseja alterar:</Text>
                            <View style={styles.radioGroup}>
                                {estoques.map(item => (
                                    <TouchableOpacity key={item.id_estoque} style={styles.radioOption} onPress={() => setTamanhoSelecionado(item)}>
                                        <FontAwesome name={tamanhoSelecionado?.id_estoque === item.id_estoque ? 'dot-circle-o' : 'circle-o'} size={22} color="#5C8E8B" />
                                        <Text style={styles.radioText}>{item.Tamanho}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={styles.controlsContainer}>
                                <TouchableOpacity style={styles.controlButton} onPress={() => alterarValor(-1)}>
                                    <FontAwesome5 name="minus" size={20} color="#FFF" />
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.quantityInput}
                                    keyboardType="numeric"
                                    placeholder="0"
                                    placeholderTextColor="#999"
                                    value={valorMudanca}
                                    onChangeText={setValorMudanca}
                                />
                                <TouchableOpacity style={styles.controlButton} onPress={() => alterarValor(1)}>
                                    <FontAwesome5 name="plus" size={20} color="#FFF" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveButton} onPress={handleSalvarEstoque}>
                                    <FontAwesome5 name="save" size={24} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F4F1E9' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollContainer: { paddingHorizontal: 20, paddingBottom: 40 },
    circle: { position: 'absolute', opacity: 0.7, zIndex: -1 },
    circleOne: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#D9A583', top: -50, left: -80 },
    circleTwo: { width: 300, height: 300, borderRadius: 150, backgroundColor: '#9FB5A8', top: 100, right: -120 },
    circleThree: { width: 250, height: 250, borderRadius: 125, backgroundColor: '#8C5F54', bottom: 130, left: -100 },
    circleFour: { width: 350, height: 350, borderRadius: 175, backgroundColor: '#D9C47E', bottom: -130, right: -100 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
    backButton: { marginRight: 15, padding: 5 },
    headerIcon: { width: 35, height: 35, marginRight: 10 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    card: { backgroundColor: '#FFF', borderRadius: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
    imageContainer: { backgroundColor: '#F0F0F0', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 15, alignItems: 'center' },
    mainImage: { width: '80%', height: 200, resizeMode: 'contain' },
    uniformeTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginVertical: 15 },
    estoqueContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingVertical: 15, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#EEE' },
    estoqueList: { flex: 1 },
    estoqueItem: { fontSize: 18, color: '#444', marginBottom: 5 },
    estoqueTotal: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    actionsContainer: { padding: 20 },
    actionsTitle: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 15 },
    radioGroup: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20 },
    radioOption: { flexDirection: 'row', alignItems: 'center' },
    radioText: { marginLeft: 8, fontSize: 16, fontWeight: '500' },
    controlsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    controlButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#8C5F54', justifyContent: 'center', alignItems: 'center', elevation: 2 },
    quantityInput: {
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 10,
        height: 50,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333'
    },
    saveButton: {
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#5C8E8B',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        marginLeft: 10
    },
});