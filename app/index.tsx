import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  ImageSourcePropType
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

const MenuButton = ({ iconSource, title, onPress }: { iconSource: ImageSourcePropType, title: string, onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image source={iconSource} style={styles.buttonIconImage} />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default function TelaInicio() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F1E9" />
      <View style={styles.container}>
        <View style={[styles.circle, styles.circleOne]} />
        <View style={[styles.circle, styles.circleTwo]} />
        <View style={[styles.circle, styles.circleThree]} />
        <View style={[styles.circle, styles.circleFour]} />
        <View style={styles.content}>
          <Text style={styles.title}>
            Bem-Vindo! O que {'\n'} gostaria de consultar hoje?
          </Text>

          <Link href="/pedidos" asChild>
            <MenuButton
              iconSource={require('../assets/icons/pedidos.png')}
              title="Pedidos"
              onPress={() => { }}
            />
          </Link>

          <MenuButton
            iconSource={require('../assets/icons/uniformes gestao.png')}
            title="Estoque Uniformes"
            onPress={() => alert('Uniformes clicado!')}
          />
          <MenuButton
            iconSource={require('../assets/icons/armarios gestao.png')}
            title="Estoque Armários"
            onPress={() => alert('Armários clicado!')}
          />
          <MenuButton
            iconSource={require('../assets/icons/relatorio.png')}
            title="Relatório de Vendas"
            onPress={() => alert('Relatório de Vendas clicado!')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F1E9' },
  container: { flex: 1 },
  circle: { position: 'absolute', opacity: 0.7 },
  circleOne: { width: 250, height: 250, borderRadius: 150, backgroundColor: '#D9A583', top: -80, left: -80 },
  circleTwo: { width: 300, height: 300, borderRadius: 150, backgroundColor: '#9FB5A8', top: 100, right: -120 },
  circleThree: { width: 250, height: 250, borderRadius: 125, backgroundColor: '#8C5F54', bottom: 80, left: -100 },
  circleFour: { width: 350, height: 350, borderRadius: 175, backgroundColor: '#D9C47E', bottom: -150, right: -100 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 26, fontWeight: '600', color: '#333', textAlign: 'center', marginBottom: 50 },
  button: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 30, marginBottom: 20, width: '90%', maxWidth: 400, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  buttonIconImage: { width: 35, height: 35, marginRight: 20 },
  buttonText: { fontSize: 18, fontWeight: '500', color: '#333' },
});