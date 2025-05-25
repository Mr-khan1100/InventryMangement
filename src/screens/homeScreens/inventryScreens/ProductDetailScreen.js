import React from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { COLORS } from '../../../styles/theme';
import CustomHeader from '../../../sharedComponents/CustomHeader';


const ProductDetailScreen = ({navigation, route }) => {
  const { product } = route.params || {};
  const width = Dimensions.get('window').width;


  // Ensure images array exists
  const images = product?.images || [];

  const renderCarouselItem = ({ item, index }) => (
    <View style={styles.carouselItem} key={index}>
      <Image
        source={{ uri: item?.uri }}
        style={styles.carouselImage}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <>
    <CustomHeader title={'Details'} showBackIcon={true} onBackPress={()=> navigation.goBack()}/>
    <ScrollView contentContainerStyle={styles.container}>
      {/* Conditional render for carousel */}
      <View style={styles.carouselContainer}>
        <Carousel
          loop={false}
          width={width}
          height={300}
          data={images}
          scrollAnimationDuration={1000}
          renderItem={renderCarouselItem}
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
          }}
          ListEmptyComponent={
            <View style={styles.placeholderContainer}>
              <Text>No images available</Text>
            </View>
          }
        />
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{product.title || 'Untitled Product'}</Text>
        <Text style={styles.price}>₹{(product.price || 0).toFixed(2)}</Text>
        <Text style={styles.description}>{product.description || 'No description available'}</Text>
        
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>
            Stock: {product.quantity || 0} units
          </Text>
          <Text style={styles.metaText}>
            Low Stock Threshold: {product.lowStockThreshold || 0} units
          </Text>
        </View>
      </View>
    </ScrollView>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: COLORS.background,
  },
  carouselContainer: {
    marginTop: 20,
    height: 300,
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightGray,
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.headerLabel,
    marginBottom: 10,
  },
  price: {
    fontSize: 22,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 24,
    marginBottom: 20,
  },
  metaContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 15,
  },
  metaText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
});

export default ProductDetailScreen;