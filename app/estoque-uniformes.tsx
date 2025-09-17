import { fetchUniformes } from '@/lib/fetchUniformes'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { Link, Stack } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const UniformeIcon = require('../assets/icons/uniformes gestao.png');

interface Uniforme {
    id_uniforme: number;
    Nome: string;
    Img: string;
    Categoria: string;
}

const categorias = [
    { label: "Todos", value: "Todos" },
    { label: "Camisetas", value: "Camiseta" },
    { label: "Agasalhos", value: "Casaco" },
    { label: "Calça e Short", value: ['Calca', 'Short'] },
];

export default function TelaEstoqueUniformes() {
    const [uniformes, setUniformes] = useState<Uniforme[]>([])
    const [loading, setLoading] = useState(true)
    const [textoPesquisa, setTextoPesquisa] = useState('')
    const [filtroCategoria, setFiltroCategoria] = useState<string | string[]>('Todos')

    useEffect(() => {
        const carregarUniformes = async () => {
            setLoading(true)
            const data = await fetchUniformes()
            setUniformes(data)
            setLoading(false)
        }
        carregarUniformes()
    }, [])

    const uniformesFiltrados = useMemo(() => {
        return uniformes
            .filter(uniforme => {
                if (filtroCategoria === 'Todos') return true;
                if (Array.isArray(filtroCategoria)) {
                    return filtroCategoria.some(cat => uniforme.Categoria?.toLowerCase() === cat.toLowerCase());
                }
                return uniforme.Categoria?.toLowerCase() === filtroCategoria.toLowerCase();
            })
            .filter(uniforme => {
                return uniforme.Nome.toLowerCase().includes(textoPesquisa.toLowerCase());
            });
    }, [uniformes, textoPesquisa, filtroCategoria])

    const renderUniformeCard = ({ item }: { item: Uniforme }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.Img }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.Nome}</Text>
            <Link href={`/estoque-uniformes/${item.id_uniforme}`} asChild>
                <TouchableOpacity style={styles.cardButton}>
                    <Text style={styles.cardButtonText}>Ver</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );

    if (loading) {
        return <SafeAreaView style={styles.safeArea}><View style={styles.loadingContainer}><ActivityIndicator size="large" color="#5C8E8B" /></View></SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={[styles.circle, styles.circleOne]} />
            <View style={[styles.circle, styles.circleTwo]} />
            <View style={[styles.circle, styles.circleThree]} />
            <View style={[styles.circle, styles.circleFour]} />

            <View style={styles.header}>
                <Link href="/" asChild><TouchableOpacity style={styles.backButton}><FontAwesome5 name="arrow-left" size={24} color="#333" /></TouchableOpacity></Link>
                <Image source={UniformeIcon} style={styles.headerIcon} />
                <Text style={styles.headerTitle}>Estoque de Uniformes</Text>
            </View>

            <View style={styles.searchContainer}>
                <TextInput style={styles.searchInput} placeholder="Pesquise aqui..." placeholderTextColor="#888" value={textoPesquisa} onChangeText={setTextoPesquisa} />
                <FontAwesome name="search" size={20} color="#888" style={styles.searchIcon} />
            </View>

            <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
                    {categorias.map(categoria => (
                        <TouchableOpacity
                            key={categoria.label}
                            style={[styles.categoryButton, filtroCategoria === categoria.value && styles.categoryButtonActive]}
                            onPress={() => setFiltroCategoria(categoria.value)}
                        >
                            <Text style={[styles.categoryButtonText, filtroCategoria === categoria.value && styles.categoryButtonTextActive]}>{categoria.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={uniformesFiltrados}
                renderItem={renderUniformeCard}
                keyExtractor={item => item.id_uniforme.toString()}
                contentContainerStyle={styles.listContainer}
                numColumns={2}
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
    listContainer: { paddingHorizontal: 15, paddingTop: 10 },
    card: { flex: 1, backgroundColor: '#FFF', borderRadius: 15, margin: 5, padding: 10, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
    cardImage: { width: '100%', height: 120, borderRadius: 10, marginBottom: 10, resizeMode: 'contain' },
    cardTitle: { fontSize: 16, fontWeight: '600', color: '#333', textAlign: 'center', marginBottom: 10 },
    cardButton: { backgroundColor: '#5C8E8B', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 25 },
    cardButtonText: { fontSize: 14, fontWeight: 'bold', color: '#FFF' },
})