import { FontAwesome5 } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

LocaleConfig.locales['pt-br'] = {
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export default function TelaSelecionarDataRelatorio() {
    const { tipo } = useLocalSearchParams();
    const router = useRouter();

    const [dataInicio, setDataInicio] = useState(new Date());
    const [dataFim, setDataFim] = useState(new Date());

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [datePickerMode, setDatePickerMode] = useState<'inicio' | 'fim'>('inicio');

    const [calendarDate, setCalendarDate] = useState(new Date().toISOString().split('T')[0]);
    const [showYearPicker, setShowYearPicker] = useState(false);

    const openCalendar = (mode: 'inicio' | 'fim') => {
        setDatePickerMode(mode);
        const targetDate = mode === 'inicio' ? dataInicio : dataFim;
        setCalendarDate(targetDate.toISOString().split('T')[0]);
        setIsModalVisible(true);
    };

    const onDaySelect = (day) => {
        const selectedDate = new Date(day.timestamp);
        if (datePickerMode === 'inicio') {
            setDataInicio(selectedDate);
        } else {
            setDataFim(selectedDate);
        }
        setIsModalVisible(false);
        setShowYearPicker(false);
    };

    const formatarData = (data: Date) => {
        return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

    const formatarDataParaURL = (data: Date) => {
        return data.toISOString().split('T')[0];
    };

    const gerarRelatorio = () => {
        const params = {
            dataInicio: formatarDataParaURL(dataInicio),
            dataFim: formatarDataParaURL(dataFim)
        };
        if (tipo === 'uniformes') {
            router.push({ pathname: "/relatorio-vendas/uniformes-resultado", params });
        } else if (tipo === 'armarios') {
            router.push({ pathname: "/relatorio-vendas/armarios-resultado", params });
        }
    };

    const getMarkedDates = () => {
        const inicioStr = formatarDataParaURL(dataInicio);
        const fimStr = formatarDataParaURL(dataFim);
        const marked = {};
        marked[inicioStr] = { selected: true, startingDay: true, color: '#5C8E8B', textColor: 'white' };
        marked[fimStr] = { selected: true, endingDay: true, color: '#5C8E8B', textColor: 'white' };
        return marked;
    }

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
                                markedDates={getMarkedDates()}
                                markingType={'period'}
                                current={calendarDate}
                                onMonthChange={(month) => {
                                    setCalendarDate(month.dateString);
                                }}
                                renderHeader={renderHeader}
                            />
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <View style={styles.header}>
                <Link href="/relatorio-vendas" asChild><TouchableOpacity style={styles.backButton}><FontAwesome5 name="arrow-left" size={24} color="#333" /></TouchableOpacity></Link>
                <FontAwesome5 name="chart-bar" size={30} color="#333" style={styles.headerIcon} />
                <Text style={styles.headerTitle}>Relatório de Vendas</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Defina uma data de início e fim para gerar o relatório:</Text>
                    <TouchableOpacity style={styles.dateButton} onPress={() => openCalendar('inicio')}>
                        <Text style={styles.dateLabel}>Início: </Text>
                        <Text style={styles.dateValue}>{formatarData(dataInicio)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dateButton} onPress={() => openCalendar('fim')}>
                        <Text style={styles.dateLabel}>Fim: </Text>
                        <Text style={styles.dateValue}>{formatarData(dataFim)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.generateButton} onPress={gerarRelatorio}>
                        <Text style={styles.generateButtonText}>Gerar Relatório</Text>
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
    headerIcon: { marginRight: 10 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    card: { backgroundColor: '#FFFFFF', width: '100%', borderRadius: 20, padding: 30, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, alignItems: 'center' },
    cardTitle: { fontSize: 20, fontWeight: '500', color: '#333', textAlign: 'center', marginBottom: 30 },
    dateButton: { flexDirection: 'row', alignItems: 'center', width: '100%', paddingVertical: 15, borderBottomWidth: 1, borderColor: '#EEE', marginBottom: 20 },
    dateLabel: { fontSize: 18, color: '#555', fontWeight: '600' },
    dateValue: { fontSize: 18, color: '#333' },
    generateButton: { backgroundColor: '#5C8E8B', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, marginTop: 20, elevation: 3 },
    generateButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    calendarContainer: { width: '90%', maxHeight: '80%', backgroundColor: 'white', borderRadius: 15, padding: 10 },
    calendarHeader: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 10, },
    calendarHeaderText: { fontSize: 18, fontWeight: 'bold' },
    calendarHeaderYear: { fontSize: 18, fontWeight: 'bold', color: '#5C8E8B' },
    yearItem: { padding: 15, borderBottomWidth: 1, borderColor: '#EEE' },
    yearText: { textAlign: 'center', fontSize: 18 },
});