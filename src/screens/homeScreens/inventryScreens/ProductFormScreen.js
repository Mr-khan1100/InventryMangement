// screens/ProductFormScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { COLORS } from '../../../styles/theme';
import CustomHeader from '../../../sharedComponents/CustomHeader';
import InputFields from '../../../sharedComponents/InputFields';
import { BlueButton } from '../../../sharedComponents/BlueButton';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { requestGalleryPermission } from '../../../utilities/AppHooks';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, updateProduct } from '../../../redux/slices/productsSlice';
import { addUserActivity } from '../../../redux/slices/usersSlice';

const ProductFormScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.currentUser);
  const { product, categoryId } = route.params || {};
  console.log('Product Form Params:', route.params);
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '',
    lowStockThreshold: '',
    images: [],
    categoryId: categoryId || ''
  });
 
  const [errors, setErrors] = useState({
    title: null,
    description: null,
    price: null,
    quantity: null,
    lowStockThreshold: null,
    images: null
  });

  useEffect(() => {
    if (product) {
      setProductData({
        title: product.title || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        quantity: product.quantity?.toString() || '',
        lowStockThreshold: product.lowStockThreshold?.toString() || '',
        images: product.images || [],
        categoryId: product.categoryId || categoryId || ''
      });
    }
  }, [product]);

  const handleImagePicker = async (type) => {
    if (productData.images.length >= 4) {
      Alert.alert('Maximum 4 images allowed');
      return;
    }

    const isPermissionGranted = await requestGalleryPermission();
    if (!isPermissionGranted) {
      setErrors(prev => ({ ...prev, images: 'Permission denied to access gallery' }));
      return;
    }

    const options = {
      cropping: true,
      cropperAspectRatio: 4/3,
      freeStyleCropEnabled: false,
      mediaType: 'photo',
      includeBase64: true,
      compressImageQuality: 0.8,
    };

    try {
      const image = await (type === 'gallery' 
        ? ImagePicker.openPicker(options)
        : ImagePicker.openCamera(options));

      setProductData(prev => ({
        ...prev,
        images: [...prev.images, {
          uri: image.path,
          base64: image.data,
          mime: image.mime
        }]
      }));
      setErrors(prev => ({ ...prev, images: null }));
    } catch (error) {
      if (!error.message.includes('CANCELLED')) {
        setErrors(prev => ({ ...prev, images: 'Error selecting image' }));
      }
    }
  };

  const removeImage = (index) => {
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (field, value) => {
    const processedValue = field.includes('price') || field.includes('quantity') || field.includes('lowStockThreshold')
      ? value.replace(/[^0-9]/g, '')
      : value;

    setProductData(prev => ({ ...prev, [field]: processedValue }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateField = (field, value) => {
    let error = null;
    const numericFields = ['price', 'quantity', 'lowStockThreshold'];

    switch(field) {
      case 'title':
        if (!value.trim()) error = 'Title is required';
        else if (value.length < 3 || value.length > 50) error = 'Title must be 3-50 characters';
        break;
      
      case 'description':
        if (!value.trim()) error = 'Description is required';
        else if (value.length < 10 || value.length > 500) error = 'Description must be 10-500 characters';
        break;
      
      case 'price':
        if (!value) error = 'Price is required';
        else if (parseFloat(value) <= 0) error = 'Price must be positive';
        break;
      
      case 'quantity':
        if (!value) error = 'Quantity is required';
        else if (parseInt(value) < 0) error = 'Quantity cannot be negative';
        break;
      
      case 'lowStockThreshold':
        if (!value) error = 'Threshold is required';
        else if (parseInt(value) < 0) error = 'Threshold cannot be negative';
        break;
      
      case 'images':
        if (productData.images.length === 0) error = 'At least one image is required';
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateAllFields = () => {
    const fields = ['title', 'description', 'price', 'quantity', 'lowStockThreshold', 'images'];
    return fields.every(field => validateField(field, productData[field]));
  };

  const handleSave = () => {
  if (!validateAllFields()) return;

  // Ensure all required fields have values
  const productPayload = {
    title: productData.title.trim(),
    description: productData.description.trim(),
    price: parseFloat(productData.price) || 0,
    quantity: parseInt(productData.quantity) || 0,
    lowStockThreshold: parseInt(productData.lowStockThreshold) || 0,
    images: productData?.images,
    categoryId: productData?.categoryId,
    createdBy: currentUser?.id,
  };
  console.log('Product Payload:', productPayload);
  // Add null checks before dispatching
  if (productPayload) {
    if (product) {
      dispatch(updateProduct({ id: product.id, ...productPayload }));
      dispatch(addUserActivity({userId: currentUser.id, activity: {
              type: 'PRODUCT_UPDATED',
              details: `Product Updated: ${productData.title}`
          }}));
    } else {
      dispatch(addProduct(productPayload));
      dispatch(addUserActivity({userId: currentUser.id, activity: {
            type: 'PRODUCT_ADDED',
            details: `Product Added: ${productData.title}`
        }}));
    }
    navigation.goBack();
  }
};

  return (
    <>
      <CustomHeader 
        title={product ? 'Edit Product' : 'Add Product'} 
        showBackIcon={true} 
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Image Section */}
          <View style={styles.imageSection}>
            <View style={styles.imageGrid}>
              {productData.images.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: img.uri }} style={styles.image} />
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                  >
                    <Icon name="close" size={20} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              ))}
              
              {productData.images.length < 4 && (
                <TouchableOpacity 
                  style={styles.addImageButton}
                  onPress={() => handleImagePicker('gallery')}
                >
                  <Icon name="add-a-photo" size={30} color={COLORS.grey} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.imageButtons}>
              <TouchableOpacity 
                style={styles.imageActionButton}
                onPress={() => handleImagePicker('gallery')}
                disabled={productData.images.length >= 4}
              >
                <Icon name="photo-library" size={24} color={COLORS.grey} />
                <Text style={styles.imageButtonText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.imageActionButton}
                onPress={() => handleImagePicker('camera')}
                disabled={productData.images.length >= 4}
              >
                <Icon name="camera-alt" size={24} color={COLORS.grey} />
                <Text style={styles.imageButtonText}>Camera</Text>
              </TouchableOpacity>
            </View>
            {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
          </View>

          {/* Product Details */}
          <InputFields
            label="Product Title"
            value={productData.title}
            onChangeText={value => handleChange('title', value)}
            onBlur={() => validateField('title', productData.title)}
            error={errors.title}
            maxLength={50}
            placeholder="Enter product title"
          />

          <InputFields
            label="Description"
            value={productData.description}
            onChangeText={value => handleChange('description', value)}
            onBlur={() => validateField('description', productData.description)}
            error={errors.description}
            maxLength={500}
            placeholder="Enter detailed description"
            multiline
            numberOfLines={4}
          />

          <View style={styles.row}>
            <InputFields
              label="Price (₹)"
              value={productData.price}
              onChangeText={value => handleChange('price', value)}
              onBlur={() => validateField('price', productData.price)}
              error={errors.price}
              keyboardType="numeric"
              containerStyle={styles.inputHalf}
              placeholder="Enter price"
            />

            <InputFields
              label="Quantity"
              value={productData.quantity}
              onChangeText={value => handleChange('quantity', value)}
              onBlur={() => validateField('quantity', productData.quantity)}
              error={errors.quantity}
              keyboardType="numeric"
              containerStyle={styles.inputHalf}
              placeholder="Enter quantity"
            />
          </View>

          <InputFields
            label="Low Stock Threshold"
            value={productData.lowStockThreshold}
            onChangeText={value => handleChange('lowStockThreshold', value)}
            onBlur={() => validateField('lowStockThreshold', productData.lowStockThreshold)}
            error={errors.lowStockThreshold}
            keyboardType="numeric"
            placeholder="Enter low stock alert level"
          />

          <BlueButton 
            label={product ? "Update Product" : "Add Product"} 
            onPress={handleSave} 
          />
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    paddingBottom: 24,
  },
  imageSection: {
    marginBottom: 24,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    right: 4,
    top: 4,
    backgroundColor: COLORS.red,
    borderRadius: 10,
    padding: 4,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: COLORS.grey,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  imageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  imageButtonText: {
    color: COLORS.grey,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  inputHalf: {
    flex: 1,
  },
  errorText: {
    color: COLORS.red,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ProductFormScreen;