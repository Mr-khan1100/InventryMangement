// screens/CategoryScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import CustomHeader from '../../../sharedComponents/CustomHeader';
import SharedCard from '../../../sharedComponents/SharedCard';
import { COLORS } from '../../../styles/theme';
import addIcon from '../../../assets/addIcon.png';
import AddCategoryScreen from './CategoryFormScreen';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory } from '../../../redux/slices/categoriesSlice';
import { deleteProduct } from '../../../redux/slices/productsSlice';
import { addUserActivity } from '../../../redux/slices/usersSlice';

const ProductScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { category } = route.params || {};
    const currentUser = useSelector(state => state.auth.currentUser);
//   const categories = useSelector(state => state.categories.entities);
  const products = useSelector(state => 
    state.products?.products?.filter(p => p?.categoryId === category?.id)
  );

  console.log('Categories:', route.params);
  const handleAddCategory = () => {
    // navigate to add-category screen or open modal
    console.log('Add Category');
    navigation.navigate('ProductActionScreen', { categoryId: category.id });
  };

  const handleCardPress = (item) => {
    // navigate to category details or another screen
    console.log('Card Pressed:', item.id);
    navigation.navigate('productDetailScreen', { product: item });
  }

  const handleEdit = (item) => {
    // navigate to edit screen with item data
    console.log('Edit:', item.id); 
    navigation.navigate('ProductActionScreen', { product: item , categoryId: category.id });
  };

  const handleDelete = (item) => {
    console.log('Delete:', item.id);
    dispatch(deleteProduct(item.id));
    dispatch(addUserActivity({userId: currentUser.id, activity: {
        type: 'PRODUCT_DELETED',
        details: `Product Deleted: ${item.title}`
    }}));
  }

  const renderItem = ({ item }) => (
    console.log('Item:', item),
    <SharedCard
      imageUrl={item?.images[0]}
      title={item?.title}
      description={item.description}
      onCardPress={() => handleCardPress(item)}
      onEdit={() => handleEdit(item)}
      onDelete={() => handleDelete(item)}
    />
  );

  return (
    <>
      <CustomHeader title={`Products of ${category?.title}`} showBackIcon={true} onBackPress={() => navigation.goBack()}/>

    <View style={styles.container}>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddCategory}
      >
        <Image source={addIcon} style={styles.addImage} />
        <Text style={styles.label}>Add Product</Text>
      </TouchableOpacity>

      {/* List */}
      <FlatList
        contentContainerStyle={styles.list}
        data={products}
        keyExtractor={(item) => item?.id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No Products of {category.title} available</Text>
        )}
        windowSize={5}
        initialNumToRender={5}
        showsVerticalScrollIndicator={false}
      />
      
    </View>
    </>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.border,
    backgroundColor: COLORS.green,
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'flex-end',
    paddingVertical: 10,
    marginVertical: 16,
    maxWidth: '30%',
  },
  list: {
    paddingBottom: 16,
  },
  addImage: {
    width: 20,
    height: 20,
    marginLeft: 10,
    tintColor: COLORS.background,
  },
  label:{
    padding: 10,
    color: COLORS.background,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.emptyText,
    marginTop: 20,
  },
});
