import { fetchPrecoPadraoArmario } from '@/lib/fetchArmarios';
import { FontAwesome5 } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

const ContratoIcon = require('../assets/icons/controle-contrato.png');

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['D','S','T','Q','Q','S','S'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export default function TelaControleContrato() {
    const [preco, setPreco] = useState('');
    const [dataAnual, setDataAnual] = useState(new Date());
    const [dataSemestral, setDataSemestral] = useState(new Date());
    const [loading, setLoading] = useState(true);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [datePickerMode, setDatePickerMode] = useState<'anual' | 'semestral'>('anual');
    const [calendarDate, setCalendarDate] = useState(new Date().toISOString().split('T')[0]);
    const [showYearPicker, setShowYearPicker] = useState(false);

    useEffect(() => {
        const carregarDadosIniciais = async () => {
            setLoading(true);
            const precoPadrao = await fetchPrecoPadraoArmario();
            if (precoPadrao !== null) {
                setPreco(String(precoPadrao));
            }
            setLoading(false);
        };
        carregarDadosIniciais();
    }, []);

    const openCalendar = (mode: 'anual' | 'semestral') => {
        setDatePickerMode(mode);
        const targetDate = mode === 'anual' ? dataAnual : dataSemestral;
        setCalendarDate(targetDate.toISOString().split('T')[0]);
        setIsModalVisible(true);
    };

    const onDaySelect = (day) => {
        const selectedDate = new Date(day.timestamp);
        if (datePickerMode === 'anual') {
            setDataAnual(selectedDate);
        } else {
            setDataSemestral(selectedDate);
        }
        setIsModalVisible(false);
        setShowYearPicker(false);
    };
    
    const formatarData = (data: Date) => data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    const renderHeader = (date) => {
        const month = LocaleConfig.locales['pt-br'].monthNames[date.getMonth()];
        const year = date.getFullYear();
        return (
            <View style={styles.calendarHeader}>
                <Text style={styles.calendarHeaderText}>{`${month} de `}</Text>
                <TouchableOpacity onPress={() => setShowYearPicker(true)}>
                    <Text style={styles.calendarHeaderYear}>{year}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

    const renderYearPicker = () => (
        <FlatList
            data={years}
            keyExtractor={item => item.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.yearItem} onPress={() => {
                    const currentMonth = new Date(calendarDate).getMonth();
                    const newDate = new Date(item, currentMonth, 1);
                    setCalendarDate(newDate.toISOString().split('T')[0]);
                    setShowYearPicker(false);
                }}>
                    <Text style={styles.yearText}>{item}</Text>
                </TouchableOpacity>
            )}
        />
    );

    if (loading) {
        return <SafeAreaView style={styles.safeArea}><ActivityIndicator size="large" color="#5C8E8B" /></SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={[styles.circle, styles.circleOne]} />
            <View style={[styles.circle, styles.circleTwo]} />
            <View style={[styles.circle, styles.circleThree]} />
            <View style={[styles.circle, styles.circleFour]} />

             <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setIsModalVisible(false)}>
                    <TouchableOpacity activeOpacity={1} style={styles.calendarContainer}>
                        {showYearPicker ? renderYearPicker() : (
                            <Calendar
                                onDayPress={onDaySelect}
                                current={calendarDate}
                                onMonthChange={(month) => setCalendarDate(month.dateString)}
                                renderHeader={renderHeader}
                            />
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <View style={styles.header}>
                <Link href="/" asChild><TouchableOpacity style={styles.backButton}><FontAwesome5 name="arrow-left" size={24} color="#333" /></TouchableOpacity></Link>
                <Image source={ContratoIcon} style={styles.headerIcon} />
                <Text style={styles.headerTitle}>Controle de Contrato</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Preço (R$):</Text>
                        <TextInput style={styles.input} placeholder="Ex: 100.00" keyboardType="numeric" value={preco} onChangeText={setPreco} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Data fim do contrato anual:</Text>
                        <TouchableOpacity style={styles.input} onPress={() => openCalendar('anual')}>
                            <Text style={styles.dateText}>{formatarData(dataAnual)}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Data fim do contrato semestral:</Text>
                        <TouchableOpacity style={styles.input} onPress={() => openCalendar('semestral')}>
                            <Text style={styles.dateText}>{formatarData(dataSemestral)}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contrato:</Text>
                        <TouchableOpacity style={styles.uploadButton} onPress={() => Alert.alert("Upload", "Funcionalidade de upload a ser implementada.")}>
                            <FontAwesome5 name="file-upload" size={18} color="#333" />
                            <Text style={styles.uploadButtonText}>Fazer Upload de Arquivo</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={() => Alert.alert("Salvar", "Funcionalidade de salvar a ser implementada.")}>
                        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                    </TouchableOpacity>
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
    headerIcon: { width: 35, height: 35, marginRight: 15, resizeMode: 'contain' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    card: { backgroundColor: '#FFFFFF', width: '100%', borderRadius: 20, padding: 25, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }},
    inputGroup: { marginBottom: 25 },
    label: { fontSize: 16, color: '#555', marginBottom: 8, fontWeight: '500' },
    input: { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 15, fontSize: 16, justifyContent: 'center' },
    dateText: { fontSize: 16 },
    uploadButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0E0E0', borderRadius: 10, paddingVertical: 15, paddingHorizontal: 15, justifyContent: 'center' },
    uploadButtonText: { marginLeft: 10, fontSize: 16, color: '#333', fontWeight: '500' },
    saveButton: { backgroundColor: '#5C8E8B', borderRadius: 15, paddingVertical: 18, alignItems: 'center', marginTop: 10 },
    saveButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    calendarContainer: { width: '90%', maxHeight: '80%', backgroundColor: 'white', borderRadius: 15, padding: 10 },
    calendarHeader: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 10 },
    calendarHeaderText: { fontSize: 18, fontWeight: 'bold' },
    calendarHeaderYear: { fontSize: 18, fontWeight: 'bold', color: '#5C8E8B' },
    yearItem: { padding: 15, borderBottomWidth: 1, borderColor: '#EEE' },
    yearText: { textAlign: 'center', fontSize: 18 },
});