import { View, Text, ScrollView, StyleSheet, FlatList, Dimensions } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { COLORS } from '../../../styles/theme';
import KpiCard from '../../../sharedComponents/KpiCard';
import ListItem from '../../../sharedComponents/ListItem';
import CustomHeader from '../../../sharedComponents/CustomHeader';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 32;
const SummaryScreen = () => {
  const users = useSelector(state => state.users.entities);
  const categories = useSelector(state => state.categories.entities);
  const products = useSelector(state => state.products.products);

  // Calculate metrics
  const totalUsers = Object.keys(users).length;
  const totalCategories = Object.keys(categories).length;
  const totalProducts = Object.keys(products).length;

  // Get low stock products (quantity < threshold)
  const lowStockProducts = Object.values(products).filter(
    product => product.quantity < product.lowStockThreshold
  );

  const pieData = [
    {
      name: 'Users',
      count: totalUsers,
      color: COLORS.blue,
      legendFontColor: COLORS.black,
      legendFontSize: 14,
    },
    {
      name: 'Categories',
      count: totalCategories,
      color: COLORS.green,
      legendFontColor: COLORS.black,
      legendFontSize: 14,
    },
    {
      name: 'Products',
      count: totalProducts,
      color: COLORS.orange,
      legendFontColor: COLORS.black,
      legendFontSize: 14,
    },
  ];

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <>
    <CustomHeader title="Summary" />
    <ScrollView contentContainerStyle={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kpiContainer}>
        <KpiCard title="Total Users" value={totalUsers} color={COLORS.blue} />
        <KpiCard title="Categories" value={totalCategories} color={COLORS.green} />
        <KpiCard title="Total Products" value={totalProducts} color={COLORS.orange} />
      </ScrollView>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Categories</Text>
        <FlatList
          data={Object.values(categories)}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              subtitle={`ID: ${item.id}`}
              rightText={`Products: ${
                Object.values(products).filter(p => p.categoryId === item.id).length
              }`}
            />
          )}
          scrollEnabled={false}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Low Stock Products</Text>
        <FlatList
          data={lowStockProducts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              subtitle={`Current Stock: ${item.quantity}`}
              rightText={`Threshold: ${item.lowStockThreshold}`}
              warning={true}
            />
          )}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No low stock products</Text>
          }
        />
      </View>

      <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <PieChart
            data={pieData.map(item => ({
              name: item.name,
              population: item.count,
              color: item.color,
              legendFontColor: item.legendFontColor,
              legendFontSize: item.legendFontSize,
            }))}
            width={screenWidth}
            height={220}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            chartConfig={chartConfig}
            center={[0, 0]}
            absolute
          />
        </View>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    // justifyContent: 'flex-start',
    // backgroundColor: COLORS.background,
  },
  kpiContainer: {
    flex: 1,
    marginBottom: 24,
  },
  section: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkBlack,
    marginBottom: 12,
  },
  emptyText: {
    color: COLORS.grey,
    textAlign: 'center',
    marginVertical: 8,
  },
  chartContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    marginBottom: 24,
  },
});

export default SummaryScreen;