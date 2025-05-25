// screens/CategoryScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import CustomHeader from '../../../sharedComponents/CustomHeader';
import SharedCard from '../../../sharedComponents/SharedCard';
import { COLORS } from '../../../styles/theme';
import addIcon from '../../../assets/addIcon.png';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory } from '../../../redux/slices/categoriesSlice';
import { addUserActivity } from '../../../redux/slices/usersSlice';

const CategoryScreen = ({ navigation }) => {
    const dispatch = useDispatch();
  const categories = useSelector(state => state.categories.entities);
    const currentUser = useSelector(state => state.auth.currentUser);
    //   const users = useSelector(state => state.users.entities);
    //   const userData = users[currentUser?.id] || {};
  console.log('Categories:', categories);
  const handleAddCategory = () => {
    // navigate to add-category screen or open modal
    console.log('Add Category');
    navigation.navigate('CategoryActionScreen');
  };

  const handleCardPress = (item) => {
    // navigate to category details or another screen
    console.log('Card Pressed:', item.id);
    navigation.navigate('ProductScreen', { category: item });
  }

  const handleEdit = (item) => {
    // navigate to edit screen with item data
    console.log('Edit:', item.id); 
    navigation.navigate('CategoryActionScreen', { category: item });
  };

  const handleDelete = (item) => {
    // show confirmation & delete logic
    console.log('Delete:', item.id);
    dispatch(deleteCategory(item.id));
    dispatch(addUserActivity({userId: currentUser.id, activity: {
        type: 'CATEGORY_DELETED',
        details: `Deleted category: ${item.title}`
    }}));
     
  }

  const renderItem = ({ item }) => (
    <SharedCard
      imageUrl={item?.image}
      title={item?.title}
      description={item.description}
      onCardPress={() => handleCardPress(item)}
      onEdit={() => handleEdit(item)}
      onDelete={() => handleDelete(item)}
    />
  );

  return (
    <>
      <CustomHeader title="Categories" />

    <View style={styles.container}>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddCategory}
      >
        <Image source={addIcon} style={styles.addImage} />
        <Text style={styles.label}>Add Category</Text>
      </TouchableOpacity>

      {/* List */}
      <FlatList
        contentContainerStyle={styles.list}
        data={categories}
        keyExtractor={(item) => item?.id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No categories available</Text>
        )}
        windowSize={5}
        initialNumToRender={5}
        showsVerticalScrollIndicator={false}
      />
      
    </View>
    </>
  );
};

export default CategoryScreen;

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
