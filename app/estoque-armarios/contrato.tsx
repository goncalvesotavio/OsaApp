import { FontAwesome5 } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const ArmarioIcon = require('../../assets/icons/armarios gestao.png');

export default function TelaContratoArmario() {
    const { url } = useLocalSearchParams<{ url: string }>();

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={[styles.circle, styles.circleOne]} />
            <View style={[styles.circle, styles.circleTwo]} />
            <View style={[styles.circle, styles.circleThree]} />
            <View style={[styles.circle, styles.circleFour]} />

            <View style={styles.header}>
                <Link href=".." asChild><TouchableOpacity style={styles.backButton}><FontAwesome5 name="arrow-left" size={24} color="#333" /></TouchableOpacity></Link>
                <Image source={ArmarioIcon} style={styles.headerIcon} />
                <Text style={styles.headerTitle}>Estoque de Armários</Text>
            </View>
            
            <View style={styles.content}>
                <Text style={styles.subtitle}>Contrato de Compra Digitalizado</Text>
                <View style={styles.webviewContainer}>
                    {url ? (
                        <WebView source={{ uri: url }} style={styles.webview} />
                    ) : (
                        <Text style={styles.errorText}>URL do contrato não encontrada.</Text>
                    )}
                </View>
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
    content: { 
        flex: 1, 
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    subtitle: { fontSize: 18, color: '#444', fontWeight: '500', marginBottom: 15, textAlign: 'center' },
    webviewContainer: {
        flex: 1,
        backgroundColor: '#ffffffff',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginVertical: 20, 
    },
    webview: {
        flex: 1,
    },
    
    errorText: {
        textAlign: 'center',
        padding: 20,
        fontSize: 16,
    }
});