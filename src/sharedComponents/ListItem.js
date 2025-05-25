import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/theme';

const ListItem = ({ title, subtitle, rightText, warning }) => (
  <View style={[styles.container, warning && styles.warningContainer]}>
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
    <Text style={[styles.rightText, warning && styles.warningText]}>
      {rightText}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  warningContainer: {
    backgroundColor: COLORS.lightRed,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  rightText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 16,
  },
  warningText: {
    color: COLORS.red,
    fontWeight: 'bold',
  },
});

export default ListItem;