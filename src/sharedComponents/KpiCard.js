import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/theme';

const KpiCard = ({ title, value, color }) => (
  <View style={[styles.card, { backgroundColor: color }]}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 100,
    borderRadius: 8,
    padding: 16,
    marginRight: 12,
    justifyContent: 'center',
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
});

export default KpiCard;