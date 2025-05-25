// screens/CategoryFormScreen.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../../../styles/theme';
import CustomHeader from '../../../sharedComponents/CustomHeader';
import InputFields from '../../../sharedComponents/InputFields';
import { BlueButton } from '../../../sharedComponents/BlueButton';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { requestGalleryPermission } from '../../../utilities/AppHooks';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, updateCategory } from '../../../redux/slices/categoriesSlice';
import { ScrollView } from 'react-native-gesture-handler';
import { addUserActivity } from '../../../redux/slices/usersSlice';

const CategoryFormScreen = ({ navigation, route }) => {
  console.log('CategoryFormScreen rendered', route.params);
  const dispatch = useDispatch();
  // console.log('Current User:', currentUser);
  const item = route.params?.category || null;
  const currentUser = useSelector(state => state.auth.currentUser);

  const [itemData, setItemData] = useState({
      title: '',
      description: '',
      image: null,
    });
  
  const [errors, setErrors] = useState({
      title: null,
      description: null,
      image: null,
    });

  useEffect(() => {
    if (item) {
      setItemData({
        title: item?.title || '',
        description: item?.description || '',
        image: item?.image || null,
      });
    }
  }, [item]);

  const handleImagePicker = async (type) => {
    const isPermissionGranted = await requestGalleryPermission();
    if (!isPermissionGranted) {
      setErrors(prev => ({ ...prev, image: 'Permission denied to access gallery' }));
      return;
    }
    const options = {
      cropping: true,
      cropperAspectRatio: 3/2,
      freeStyleCropEnabled: false,
      mediaType: 'photo',
      includeBase64: true,
      cropperChooseText: 'Select',
      cropperCancelText: 'Cancel',
      cropperToolbarTitle: 'Crop Image',
      compressImageQuality: 0.8,
      cropperStatusBarColor: COLORS.background,
      cropperToolbarWidgetColor: COLORS.darkGrey,
    };

    const picker = type === 'gallery' 
      ? ImagePicker.openPicker
      : ImagePicker.openCamera;

    picker(options)
      .then(image => {
        setItemData(prev => ({
          ...prev,
          image: {
            uri: image.path,
            base64: image.data,
          }
        }));
        setErrors(prev => ({ ...prev, image: null }));
      })
      .catch(error => {
        // if (error.code !== 'E_PICKER_CANCELLED') {
          console.log('Image picker error:', error);
        setErrors(prev => ({ ...prev, image: 'Image is Required' }));

        // }
      });
  };

   const handleChange = (field, value) => {
    let processedValue = value;
    
    // Input sanitization
    switch(field) {
      case 'title':
        processedValue = value;
        break;
      case 'description':
        processedValue = value;
        break;
      case 'imageUrl':
        processedValue = value.trim();
        break;
      default:
        processedValue = value.replace(/\s+/g, '');
    }

    setItemData(prev => ({ ...prev, [field]: processedValue }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateField = (field, value) => {
      let error = null;
      const trimmedValue = typeof value === 'string' ? value.trim() : value;
  
      switch(field) {
        case 'title':
          if (!trimmedValue) {
            error = 'Title is required';
          } else if (trimmedValue.length < 3 || trimmedValue.length > 20) {
            error = 'Title must be between 3 and 20 characters';
          }
          break;
          
        case 'description':
          if (!trimmedValue) {
            error = 'Description is required';
          } else if (trimmedValue.length < 5 || trimmedValue.length > 100) {
            error = 'Description must be between 5 and 100 characters'; 
          }
          break;
          
        case 'image':
          if (!itemData.image || !itemData.image.uri) {
            error = 'Image is required';
          } else if (!itemData.image.uri.startsWith('file://') && 
                    !itemData.image.uri.startsWith('http')) {
            error = 'Invalid image format';
          }
          break;
      }
  
      setErrors(prev => ({ ...prev, [field]: error }));
      return !error;
    };

     const validateAllFields = () => {
    const fields = ['title', 'description', 'image'];
    let isValid = true;
    
    fields.forEach(field => {
      const valid = validateField(field, itemData[field]);
      if (!valid) isValid = false;
    });
    
    return isValid;
  };

  const handleSave = () => {
    // console.log('Saving item data:', itemData);
    
    if (!validateAllFields()) return;
    const categoryData = {
      title: itemData.title.trim(),
      description: itemData.description.trim(),
      image: itemData.image,
      createdBy: currentUser.id,
    };
    if (item) {
      // Update existing category
      dispatch(updateCategory({
        id: item.id,
        ...categoryData,
      }));
      dispatch(addUserActivity({userId: currentUser?.id, activity: `Updated category: ${categoryData?.title}`}));
      dispatch(addUserActivity({userId: currentUser.id, activity: {
              type: 'CATEGORY_UPDATED',
              details: `Updated category: ${categoryData.title}`
          }}));
      
    } else {
      // Create new category
      dispatch(addCategory(categoryData));
      dispatch(addUserActivity({userId: currentUser.id, activity: {
              type: 'CATEGORY_ADDED',
              details: `Added category: ${categoryData.title}`
          }}));

    }
    navigation.goBack();
  };

  return (
    <>
    <CustomHeader title={item ? 'Edit Category' : 'Add New Category'} showBackIcon={true} onBackPress={()=> navigation.goBack()}/>
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <TouchableOpacity 
            style={styles.imageContainer}
            onPress={() => handleImagePicker('gallery')}
          >
            {itemData?.image ? (
              <Image 
                source={{ uri: itemData?.image?.uri }} 
                style={styles.image}
              />
            ) : (
              <Icon name="add-a-photo" size={40} color={COLORS.darkGrey} />
            )}
          </TouchableOpacity>

          <View style={styles.imageButtons}>
            <TouchableOpacity 
              style={styles.imageButton}
              onPress={() => handleImagePicker('gallery')}
            >
              <Icon name="photo-library" size={24} color={COLORS.gret} />
              <Text style={styles.buttonText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.imageButton}
              onPress={() => handleImagePicker('camera')}
            >
              <Icon name="camera-alt" size={24} color={COLORS.gret} />
              <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>
          </View>
          {errors.image && (
            <Text style={styles.errorText}>{errors.image}</Text>
          )}
        </View>

      <InputFields
            label="Title"
            value={itemData.title}
            onChangeText={value => handleChange('title', value)}
            onBlur={() => validateField('title', itemData.title)}
            error={errors.title}
            maxLength={20}
            placeholder="Enter title"
        />

        <InputFields
            label="Description"
            value={itemData.description}
            onChangeText={value => handleChange('description', value)}
            onBlur={() => validateField('description', itemData.description)}
            error={errors.description}
            maxLength={20}
            placeholder="Enter description"
        />

      <BlueButton label={item ? 'Save Changes' : 'Add Category' } onPress={handleSave}/>
      </ScrollView>
    </View>
    </>
  );
};

export default CategoryFormScreen;

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 16,
    // backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
imageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.shadow,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.red,
    marginTop: 5,
  },
});
