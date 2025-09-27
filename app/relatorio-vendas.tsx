import { FontAwesome5 } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const UniformeIcon = require('../assets/icons/uniformes gestao.png');
const ArmarioIcon = require('../assets/icons/armarios gestao.png');

export default function TelaRelatorioVendas() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={[styles.circle, styles.circleOne]} />
            <View style={[styles.circle, styles.circleTwo]} />
            <View style={[styles.circle, styles.circleThree]} />
            <View style={[styles.circle, styles.circleFour]} />

            <View style={styles.header}>
                <Link href="/" asChild><TouchableOpacity style={styles.backButton}><FontAwesome5 name="arrow-left" size={24} color="#333" /></TouchableOpacity></Link>
                <FontAwesome5 name="chart-bar" size={30} color="#333" style={styles.headerIcon} />
                <Text style={styles.headerTitle}>Relatório de Vendas</Text>
            </View>

            <View style={styles.content}>
                <Link href="/relatorio-vendas/uniformes" asChild>
                    <TouchableOpacity style={styles.reportButton}>
                        <Image source={UniformeIcon} style={styles.reportButtonIcon} />
                        <Text style={styles.reportButtonText}>Relatório de Uniformes</Text>
                    </TouchableOpacity>
                </Link>
                <Link href="/relatorio-vendas/armarios" asChild>
                    <TouchableOpacity style={styles.reportButton}>
                        <Image source={ArmarioIcon} style={styles.reportButtonIcon} />
                        <Text style={styles.reportButtonText}>Relatório de Armários</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F4F1E9' },
    circle: { position: 'absolute', opacity: 0.7, zIndex: -1 },
    circleOne: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#D9A583', top: 0, left: -60 },
    circleTwo: { width: 300, height: 300, borderRadius: 150, backgroundColor: '#9FB5A8', top: 100, right: -120 },
    circleThree: { width: 250, height: 250, borderRadius: 125, backgroundColor: '#8C5F54', bottom: 200, left: -100 },
    circleFour: { width: 350, height: 350, borderRadius: 175, backgroundColor: '#D9C47E', bottom: -80, right: -100 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
    backButton: { marginRight: 15, padding: 5 },
    headerIcon: { marginRight: 10 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
    reportButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', width: '90%', maxWidth: 400, paddingVertical: 22, paddingHorizontal: 30, borderRadius: 20, marginBottom: 25, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
    reportButtonIcon: { width: 45, height: 45, marginRight: 20 },
    reportButtonText: { fontSize: 20, fontWeight: '600', color: '#333' },
});