import { FontAwesome5 } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ArmarioIcon = require('../assets/icons/armarios gestao.png');

const corredores = [
    { nome: "Corredor 1", href: "/estoque-armarios/1" },
    { nome: "Corredor 2", href: "/estoque-armarios/2" },
    { nome: "Corredor 3", href: null },
    { nome: "Mecânica", href: null }
];

export default function TelaEstoqueArmarios() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={[styles.circle, styles.circleOne]} />
            <View style={[styles.circle, styles.circleTwo]} />
            <View style={[styles.circle, styles.circleThree]} />
            <View style={[styles.circle, styles.circleFour]} />

            <View style={styles.header}>
                <Link href="/" asChild><TouchableOpacity style={styles.backButton}><FontAwesome5 name="arrow-left" size={24} color="#333" /></TouchableOpacity></Link>
                <Image source={ArmarioIcon} style={styles.headerIcon} />
                <Text style={styles.headerTitle}>Estoque de Armários</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.subtitle}>Selecione um corredor</Text>
                {corredores.map(corredor => {
                    if (corredor.href) {
                        return (
                            <Link key={corredor.nome} href={corredor.href} asChild>
                                <TouchableOpacity style={styles.corredorButton}>
                                    <Text style={styles.corredorButtonText}>{corredor.nome}</Text>
                                </TouchableOpacity>
                            </Link>
                        );
                    }
                    return (
                        <TouchableOpacity 
                            key={corredor.nome} 
                            style={styles.corredorButton}
                            onPress={() => Alert.alert("Em breve", `A tela para o corredor "${corredor.nome}" ainda será construída.`)}
                        >
                            <Text style={styles.corredorButtonText}>{corredor.nome}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
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
    content: { flex: 1, alignItems: 'center', paddingTop: 30 },
    subtitle: { fontSize: 26, color: '#444', fontWeight: '500', marginBottom: 30 },
    corredorButton: { backgroundColor: '#FFFFFF', width: '80%', paddingVertical: 24, borderRadius: 15, alignItems: 'center', marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
    corredorButtonText: { fontSize: 20, fontWeight: '600', color: '#333' },
});