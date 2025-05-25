import { PermissionsAndroid, Platform } from "react-native";

export const requestGalleryPermission = async () => {
  let permissionGranted = false;
if(Platform.OS == 'android'){
  try {
    if (Platform.Version >= 33) {
      console.log('Requesting permissions for Android 13+...');

      const permissionResponse = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]);

      console.log('Permission response for READ_MEDIA_IMAGES:', permissionResponse[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES]);
      console.log('Permission response for READ_MEDIA_VIDEO:', permissionResponse[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO]);

      if (
        permissionResponse[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        permissionResponse[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Permissions for READ_MEDIA_IMAGES and READ_MEDIA_VIDEO granted.');
        permissionGranted = true;
      } else if (
        permissionResponse[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === 'never_ask_again' ||
        permissionResponse[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] === 'never_ask_again'
      ) {
        console.warn('Permissions set to "Never ask again". Directing user to settings...');
      } else {
        console.warn('One or more permissions for media access were denied.');
      }
    } else {
      console.log('Requesting permissions for Android versions below 13...');

      const permissionResponse = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );

      console.log('Permission response for READ_EXTERNAL_STORAGE:', permissionResponse);

      if (permissionResponse === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission for READ_EXTERNAL_STORAGE granted.');
        permissionGranted = true;
      } else {
        console.warn('Permission for READ_EXTERNAL_STORAGE denied.');
      }
    }
  } catch (error) {
    console.error('Error while requesting permissions:', error);
  }
}
else if (Platform.OS === 'ios') {
  permissionGranted = true;
    console.log('iOS platform detected. Gallery permissions are automatically granted.');
}
  console.log('Permission granted:', permissionGranted);
  return permissionGranted;

};