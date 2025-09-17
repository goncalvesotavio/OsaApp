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

export default function TelaDetalheCorredor() {
    const { id: corredorId } = useLocalSearchParams();
    const [armarioSelecionado, setArmarioSelecionado] = useState<number | null>(null);
    
    const SecaoArmario = ({ secao }) => (
        <View style={styles.secaoContainer}>
            <Text style={styles.secaoTitulo}>{secao.titulo}</Text>
            <FlatList
                data={secao.armarios}
                keyExtractor={item => item.toString()}
                numColumns={4}
                renderItem={({ item: num }) => (
                    <TouchableOpacity
                        style={[ styles.botaoArmario, armarioSelecionado === num && styles.selecionado ]}
                        onPress={() => setArmarioSelecionado(num)}
                    >
                        <Text style={styles.botaoArmarioTexto}>{num}</Text>
                    </TouchableOpacity>
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
        </View>
    );
    
    const LayoutCorredor1 = () => (
        <View style={styles.layoutContainer}>
            <View style={styles.sidebarContainer}>
                <View style={styles.linhaConectora} />
                <LinhaSala numero={1} />
                <View style={{height: 168}} />
                <View style={{height: 168}} />
                <LinhaSala numero={2} />
                <View style={{height: 168}} />
                <View style={{height: 168}} />
                <View style={{height: 168}} />
                <LinhaSala numero={3} />
                <View style={{height: 168}} />
                <View style={{height: 168}} />
                <LinhaSala numero={4} />
                <View style={{height: 80}} />
                <LinhaSala numero={5} />
                <View style={{height: 168}} />
                <View style={{height: 168}} />
                <LinhaSala numero={6} />
                <View style={{height: 168}} />
                <View style={{height: 168}} />
                <LinhaSala numero={7} />
            </View>
            <View style={styles.armariosContainer}>
                <SecaoArmario secao={secoesCorredor1[0]} />
                <SecaoArmario secao={secoesCorredor1[1]} />
                <SecaoArmario secao={secoesCorredor1[2]} />
                <SecaoArmario secao={secoesCorredor1[3]} />
                <SecaoArmario secao={secoesCorredor1[4]} />
                <SecaoArmario secao={secoesCorredor1[5]} />
                <SecaoArmario secao={secoesCorredor1[6]} />
                <SecaoArmario secao={secoesCorredor1[7]} />
                <SecaoArmario secao={secoesCorredor1[8]} />
                <SecaoArmario secao={secoesCorredor1[9]} />
                <SecaoArmario secao={secoesCorredor1[10]} />
                <SecaoArmario secao={secoesCorredor1[11]} />
            </View>
        </View>
    );

    const LayoutCorredor2 = () => (
        <View style={styles.layoutContainer}>
            <View style={styles.sidebarContainer}>
                <View style={styles.linhaConectora} />
                <View style={{height: 100}} />
                <LinhaSala numero={8} />
                <View style={{height: 250}}/>
                <LinhaSala numero={9} />
                <View style={{height: 250}}/>
                <LinhaSala numero={10} />
                <View style={{height: 250}}/>
                <LinhaSala numero={11} />
                <View style={{height: 250}}/>
                <LinhaSala numero={12} />
            </View>
            <View style={styles.armariosContainer}>
                <SecaoArmario secao={secoesCorredor2[0]} />
                <SecaoArmario secao={secoesCorredor2[1]} />
                <SecaoArmario secao={secoesCorredor2[2]} />
                <SecaoArmario secao={secoesCorredor2[3]} />
                <SecaoArmario secao={secoesCorredor2[4]} />
                <SecaoArmario secao={secoesCorredor2[5]} />
                <SecaoArmario secao={secoesCorredor2[6]} />
                <SecaoArmario secao={secoesCorredor2[7]} />
                <SecaoArmario secao={secoesCorredor2[8]} />
                <SecaoArmario secao={secoesCorredor2[9]} />
            </View>
        </View>
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
                {corredorId === '1' && <LayoutCorredor1 />}
                {corredorId === '2' && <LayoutCorredor2 />}
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
    scrollContainer: { paddingBottom: 20 },
    layoutContainer: { flexDirection: 'row' },
    sidebarContainer: {
        width: 80,
        alignItems: 'center',
        paddingTop: 25,
        paddingBottom: 25,
    },
    linhaConectora: {
        position: 'absolute',
        top: 50,
        bottom: 50,
        width: 26,
        backgroundColor: '#9FB5A8',
        borderRadius: 13,
    },
    linhaSala: {
        height: 50,
        justifyContent: 'center',
        zIndex: 1,
    },
    sidebarNumero: { 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        backgroundColor: '#D9C47E', 
        justifyContent: 'center', 
        alignItems: 'center', 
        elevation: 3, 
        shadowColor: '#000', 
        shadowOpacity: 0.2, 
        shadowRadius: 3, 
        shadowOffset: { width: 0, height: 2 },
    },
    sidebarTexto: { 
        color: '#FFF', 
        fontWeight: 'bold', 
        fontSize: 12 
    },
    armariosContainer: {
        flex: 1,
        paddingRight: 10,
    },
    secaoContainer: { 
        marginBottom: 20 
    },
    secaoTitulo: { 
        textAlign: 'center', 
        fontWeight: '600', 
        color: '#666', 
        marginBottom: 10,
        fontSize: 18
    },
    gridRow: { 
        justifyContent: 'flex-start' 
    },
    botaoArmario: { 
        width: '22%', 
        aspectRatio: 1, 
        margin: '1.5%', 
        backgroundColor: '#FFF', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 8, 
        borderWidth: 1, 
        borderColor: '#DDD' 
    },
    selecionado: { 
        borderColor: '#FFA500', 
        borderWidth: 2, 
        backgroundColor: '#FFF8E1' 
    },
    botaoArmarioTexto: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#333' 
    },
});