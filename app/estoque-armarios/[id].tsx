import { FontAwesome5 } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ArmarioIcon = require('../../assets/icons/armarios gestao.png');

const secoesCorredor1 = [
    { secao: 1, titulo: 'Armário Nº1', armarios: Array.from({ length: 20 }, (_, i) => i + 1) },
    { secao: 2, titulo: 'Armário Nº2', armarios: Array.from({ length: 16 }, (_, i) => i + 21) },
    { secao: 3, titulo: 'Armário Nº3', armarios: Array.from({ length: 16 }, (_, i) => i + 37) },
    { secao: 4, titulo: 'Armário Nº4', armarios: Array.from({ length: 16 }, (_, i) => i + 53) },
    { secao: 5, titulo: 'Armário Nº5', armarios: Array.from({ length: 16 }, (_, i) => i + 69) },
    { secao: 6, titulo: 'Armário Nº6', armarios: Array.from({ length: 20 }, (_, i) => i + 85) },
    { secao: 7, titulo: 'Armário Nº7', armarios: Array.from({ length: 16 }, (_, i) => i + 105) },
    { secao: 8, titulo: 'Armário Nº8', armarios: Array.from({ length: 16 }, (_, i) => i + 121) },
    { secao: 9, titulo: 'Armário Nº9', armarios: Array.from({ length: 16 }, (_, i) => i + 137) },
    { secao: 10, titulo: 'Armário Nº10', armarios: Array.from({ length: 16 }, (_, i) => i + 153) },
    { secao: 11, titulo: 'Armário Nº11', armarios: Array.from({ length: 20 }, (_, i) => i + 169) },
    { secao: 12, titulo: 'Armário Nº12', armarios: Array.from({ length: 16 }, (_, i) => i + 189) }
];

const secoesCorredor2 = [
    { secao: 13, titulo: 'Armário Nº13', armarios: Array.from({ length: 16 }, (_, i) => i + 205) },
    { secao: 14, titulo: 'Armário Nº14', armarios: Array.from({ length: 16 }, (_, i) => i + 221) },
    { secao: 15, titulo: 'Armário Nº15', armarios: Array.from({ length: 20 }, (_, i) => i + 237) },
    { secao: 16, titulo: 'Armário Nº16', armarios: Array.from({ length: 16 }, (_, i) => i + 257) },
    { secao: 17, titulo: 'Armário Nº17', armarios: Array.from({ length: 16 }, (_, i) => i + 273) },
    { secao: 18, titulo: 'Armário Nº18', armarios: Array.from({ length: 16 }, (_, i) => i + 289) },
    { secao: 19, titulo: 'Armário Nº19', armarios: Array.from({ length: 16 }, (_, i) => i + 305) },
    { secao: 20, titulo: 'Armário Nº20', armarios: Array.from({ length: 16 }, (_, i) => i + 321) },
    { secao: 21, titulo: 'Armário Nº21', armarios: Array.from({ length: 16 }, (_, i) => i + 337) },
    { secao: 22, titulo: 'Armário Nº22', armarios: Array.from({ length: 16 }, (_, i) => i + 353) }
];

const secoesCorredor3 = [
    { secao: 23, titulo: 'Armário Nº23', armarios: Array.from({ length: 20 }, (_, i) => i + 369) },
    { secao: 24, titulo: 'Armário Nº24', armarios: Array.from({ length: 16 }, (_, i) => i + 389) },
    { secao: 25, titulo: 'Armário Nº25', armarios: Array.from({ length: 16 }, (_, i) => i + 405) },
    { secao: 26, titulo: 'Armário Nº26', armarios: Array.from({ length: 16 }, (_, i) => i + 421) },
    { secao: 27, titulo: 'Armário Nº27', armarios: Array.from({ length: 16 }, (_, i) => i + 437) },
    { secao: 28, titulo: 'Armário Nº28', armarios: Array.from({ length: 20 }, (_, i) => i + 453) }
];

const secoesMecanica = [
    { secao: 29, titulo: 'Armário Nº29', armarios: Array.from({ length: 20 }, (_, i) => i + 473) },
    { secao: 30, titulo: 'Armário Nº30', armarios: Array.from({ length: 20 }, (_, i) => i + 493) },
    { secao: 31, titulo: 'Armário Nº31', armarios: Array.from({ length: 8 }, (_, i) => i + 513) },
    { secao: 32, titulo: 'Armário Nº32', armarios: Array.from({ length: 8 }, (_, i) => i + 521) },
    { secao: 33, titulo: 'Armário Nº33', armarios: Array.from({ length: 8 }, (_, i) => i + 529) }
];

export default function TelaDetalheCorredor() {
    const { id: corredorId } = useLocalSearchParams();

    const SecaoArmario = ({ secao }) => (
        <View style={styles.secaoContainer}>
            <Text style={styles.secaoTitulo}>{secao.titulo}</Text>
            <FlatList
                data={secao.armarios}
                keyExtractor={item => item.toString()}
                numColumns={4}
                renderItem={({ item: num }) => (
                    <Link href={`/estoque-armarios/detalhe/${num}`} asChild>
                        <TouchableOpacity style={styles.botaoArmario}>
                            <Text style={styles.botaoArmarioTexto}>{num}</Text>
                        </TouchableOpacity>
                    </Link>
                )}
                scrollEnabled={false}
                columnWrapperStyle={styles.gridRow}
            />
        </View>
    );

    const LinhaSala = ({ numero }) => (
        <View style={styles.linhaSala}>
            <View style={styles.sidebarNumero}>
                <Text style={styles.sidebarTexto}>SALA</Text>
                <Text style={styles.sidebarTexto}>{numero}</Text>
            </View>
            <View style={styles.secaoEspaco} />
        </View>
    );

    const LayoutCorredor1 = () => (
        <><LinhaSala numero={1} /><SecaoArmario secao={secoesCorredor1[0]} /><SecaoArmario secao={secoesCorredor1[1]} /><LinhaSala numero={2} /><SecaoArmario secao={secoesCorredor1[2]} /><SecaoArmario secao={secoesCorredor1[3]} /><SecaoArmario secao={secoesCorredor1[4]} /><LinhaSala numero={3} /><SecaoArmario secao={secoesCorredor1[5]} /><SecaoArmario secao={secoesCorredor1[6]} /><LinhaSala numero={4} /><SecaoArmario secao={secoesCorredor1[7]} /><LinhaSala numero={5} /><SecaoArmario secao={secoesCorredor1[8]} /><SecaoArmario secao={secoesCorredor1[9]} /><LinhaSala numero={6} /><SecaoArmario secao={secoesCorredor1[10]} /><SecaoArmario secao={secoesCorredor1[11]} /><LinhaSala numero={7} /></>
    );

    const LayoutCorredor2 = () => (
        <><SecaoArmario secao={secoesCorredor2[0]} /><LinhaSala numero={8} /><SecaoArmario secao={secoesCorredor2[1]} /><SecaoArmario secao={secoesCorredor2[2]} /><SecaoArmario secao={secoesCorredor2[3]} /><LinhaSala numero={9} /><SecaoArmario secao={secoesCorredor2[4]} /><SecaoArmario secao={secoesCorredor2[5]} /><LinhaSala numero={10} /><SecaoArmario secao={secoesCorredor2[6]} /><SecaoArmario secao={secoesCorredor2[7]} /><LinhaSala numero={11} /><SecaoArmario secao={secoesCorredor2[8]} /><SecaoArmario secao={secoesCorredor2[9]} /><LinhaSala numero={12} /></>
    );

    const LayoutCorredor3 = () => (
        <><LinhaSala numero={13} /><SecaoArmario secao={secoesCorredor3[0]} /><SecaoArmario secao={secoesCorredor3[1]} /><LinhaSala numero={14} /><SecaoArmario secao={secoesCorredor3[2]} /><SecaoArmario secao={secoesCorredor3[3]} /><SecaoArmario secao={secoesCorredor3[4]} /><LinhaSala numero={15} /><SecaoArmario secao={secoesCorredor3[5]} /><LinhaSala numero={16} /></>
    );

    const LayoutMecanica = () => (
        <><SecaoArmario secao={secoesMecanica[0]} /><SecaoArmario secao={secoesMecanica[1]} /><LinhaSala numero={17} /><SecaoArmario secao={secoesMecanica[2]} /><SecaoArmario secao={secoesMecanica[3]} /><SecaoArmario secao={secoesMecanica[4]} /><LinhaSala numero={18} /></>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={[styles.circle, styles.circleOne]} />
            <View style={[styles.circle, styles.circleTwo]} />
            <View style={[styles.circle, styles.circleThree]} />
            <View style={[styles.circle, styles.circleFour]} />

            <View style={styles.header}>
                <Link href="/estoque-armarios" asChild><TouchableOpacity style={styles.backButton}><FontAwesome5 name="arrow-left" size={24} color="#333" /></TouchableOpacity></Link>
                <Image source={ArmarioIcon} style={styles.headerIcon} />
                <Text style={styles.headerTitle}>Estoque de Armários</Text>
            </View>
            
            <Text style={styles.subtitle}>Selecione um armário:</Text>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.linhaConectora} />
                {corredorId === '1' && <LayoutCorredor1 />}
                {corredorId === '2' && <LayoutCorredor2 />}
                {corredorId === '3' && <LayoutCorredor3 />}
                {corredorId === 'mecanica' && <LayoutMecanica />}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F4F1E9' },
    circle: { position: 'absolute', opacity: 0.7, zIndex: -1 },
    circleOne: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#D9A583', top: -50, left: -80 },
    circleTwo: { width: 300, height: 300, borderRadius: 150, backgroundColor: '#9FB5A8', top: 100, right: -120 },
    circleThree: { width: 250, height: 250, borderRadius: 125, backgroundColor: '#8C5F54', bottom: 130, left: -100 },
    circleFour: { width: 350, height: 350, borderRadius: 175, backgroundColor: '#D9C47E', bottom: -130, right: -100 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
    backButton: { marginRight: 15, padding: 5 },
    headerIcon: { width: 35, height: 35, marginRight: 10 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    subtitle: { fontSize: 22, color: '#444', fontWeight: '500', marginBottom: 15, textAlign: 'center' },
    scrollContainer: { paddingHorizontal: 10, paddingTop: 20 },
    linhaConectora: { position: 'absolute', width: 26, backgroundColor: '#9FB5A8', top: 35, bottom: 35, left: 32, borderRadius: 13 },
    linhaSala: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    sidebarNumero: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#D9C47E', justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, zIndex: 1, marginLeft: 20 },
    sidebarTexto: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
    secaoEspaco: { flex: 1 },
    secaoContainer: { marginLeft: 70, marginBottom: 20 },
    secaoTitulo: { textAlign: 'center', fontWeight: '600', color: '#666', marginBottom: 10, fontSize: 18 },
    gridRow: { justifyContent: 'flex-start' },
    botaoArmario: { width: '22%', aspectRatio: 1, margin: '1.5%', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#DDD' },
    selecionado: { borderColor: '#FFA500', borderWidth: 2, backgroundColor: '#FFF8E1' },
    botaoArmarioTexto: { fontSize: 16, fontWeight: 'bold', color: '#333' }
});