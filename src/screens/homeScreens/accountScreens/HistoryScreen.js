import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { BlueButton } from '../../../sharedComponents/BlueButton';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice';
import { CommonActions } from '@react-navigation/native';
import { COLORS } from '../../../styles/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { updateProfilePicture } from '../../../redux/slices/usersSlice';
import ImagePicker from 'react-native-image-crop-picker';
import { requestGalleryPermission } from '../../../utilities/AppHooks';
import CustomHeader from '../../../sharedComponents/CustomHeader';


const HistoryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.currentUser);
  const users = useSelector(state => state.users.entities);
  const userData = users[currentUser?.id] || {};
  const [errors, setErrors] = React.useState({ image: null });

  const handleImagePicker = async (type) => {
    const isPermissionGranted = await requestGalleryPermission();
    if (!isPermissionGranted) {
        setErrors(prev => ({ ...prev, image: 'Permission denied to access gallery' }));
        return;
    }
    try {
      const options = {
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
        includeBase64: true,
        compressImageQuality: 0.8,
      };

      const image = await (type === 'gallery' 
        ? ImagePicker.openPicker(options)
        : ImagePicker.openCamera(options));

      dispatch(updateProfilePicture({
        userId: currentUser.id,
        imageUri: image.path
      }));
      setErrors({ ...errors, image: null });
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        setErrors({ ...errors, image: 'Failed to update profile picture' });
      }
    }
  };

  const signOut = () => {
    dispatch(logout());
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      })
    );
  };

  return (
    <>
    <CustomHeader title={'History'} showBackIcon={false}/>
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.imageSection}>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={() => handleImagePicker('gallery')}
            >
              {userData?.profilePicture ? (
                <Image 
                  source={{ uri: userData.profilePicture }} 
                  style={styles.profileImage}
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
                <Icon name="photo-library" size={20} color={COLORS.background} />
                <Text style={styles.buttonText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.imageButton}
                onPress={() => handleImagePicker('camera')}
              >
                <Icon name="camera-alt" size={20} color={COLORS.background} />
                <Text style={styles.buttonText}>Camera</Text>
              </TouchableOpacity>
            </View>
            {errors.image && (
              <Text style={styles.errorText}>{errors.image}</Text>
            )}
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData?.username || 'Guest User'}</Text>
            <Text style={styles.userEmail}>{userData?.email || ''}</Text>
          </View>
        </View>

        {/* Activity History Section */}
         <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Activity History</Text>
          
          {userData?.activities?.length > 0 ? (
            userData.activities.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Icon name="history" size={20} color={COLORS.grey} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>{activity.details}</Text>
                  <Text style={styles.activityTime}>
                    {new Date(activity.timestamp).toLocaleDateString()} - 
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noActivities}>No activities found</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <BlueButton 
          label={'Sign Out'} 
          onPress={signOut} 
          buttonStyle={styles.signOutButton} 
        />
      </View>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
     container: {
    flex: 1,
    // backgroundColor: COLORS.background,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  profileSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    backgroundColor: COLORS.background,
    padding: 20,
    borderRadius: 10,
    shadowColor: COLORS.shadowColor,
  },
  imageSection: {
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.placeHolderColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORS.grey,
  },
  buttonText: {
    fontSize: 12,
    color: COLORS.background,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.topBorder,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.grey,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  historySection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.headerLabel,
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    elevation: 2,
  },
  activityIcon: {
    backgroundColor: COLORS.lightPrimary,
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: COLORS.darkBlack,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.darkGrey,
  },
  noActivities: {
    textAlign: 'center',
    color: COLORS.grey,
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  signOutButton: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.background,
  },
  signOutText: {
    color: COLORS.background,
  },
});

export default HistoryScreen;