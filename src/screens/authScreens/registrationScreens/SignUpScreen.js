import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import logo from '../../../assets/AppLogo.jpg';
import eyeClose from '../../../assets/eyeClose.jpg';
import eyeOpen from '../../../assets/eyeOpen.jpg';
import { COLORS } from '../../../styles/theme';
import InputFields from '../../../sharedComponents/InputFields';
import { generalConst, regex, validationMessage } from '../../../constants/appConstants';
import { BlueButton } from '../../../sharedComponents/BlueButton';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/slices/usersSlice';
import { loginSuccess } from '../../../redux/slices/authSlice';
import { CommonActions } from '@react-navigation/native';

const SignUpScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users.entities);
  
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({
    username: null,
    email: null,
    phoneNumber: null,
    password: null,
    confirmPassword: null
  });
  
  const [secureText, setSecureText] = useState({
    password: true,
    confirmPassword: true
  });

  const toggleSecureEntry = (field) => {
    setSecureText(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    let processedValue = value;
    
    // Input sanitization
    switch(field) {
      case 'email':
        processedValue = value.replace(/\s+/g, '').toLowerCase();
        break;
      case 'phoneNumber':
        processedValue = value.replace(/[^0-9]/g, '').slice(0, 10);
        break;
      case 'username':
        processedValue = value.replace(/[^a-zA-Z0-9_]/g, '');
        break;
      default:
        processedValue = value.replace(/\s+/g, '');
    }

    setUserData(prev => ({ ...prev, [field]: processedValue }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateField = (field, value) => {
    let error = null;
    const trimmedValue = value.trim();

    switch(field) {
      case 'username':
        if (!trimmedValue) {
          error = validationMessage.USERNAME_REQUIRED;
        } else if (!regex.USERNAME.test(trimmedValue)) {
          error = validationMessage.INVALID_USERNAME;
        }
        break;
        
      case 'email':
        if (!trimmedValue) {
          error = validationMessage.EMAIL_IS_REQUIRED;
        } else if (!regex.EMAIL.test(trimmedValue)) {
          error = validationMessage.INVALID_EMAIL;
        } else if (Object.values(users).some(user => user.email === trimmedValue)) {
          error = validationMessage.EMAIL_EXISTS;
        }
        break;
        
      case 'phoneNumber':
        if (!trimmedValue) {
          error = validationMessage.PHONE_REQUIRED;
        } else if (!regex.INDIAN_PHONE.test(trimmedValue)) {
          error = validationMessage.INVALID_PHONE;
        } else if (Object.values(users).some(user => user.phoneNumber === trimmedValue)) {
          error = validationMessage.PHONE_EXISTS;
        }
        break;
        
      case 'password':
        if (!trimmedValue) {
          error = validationMessage.PASSWORD_IS_REQUIRED;
        } else if (!regex.PASSWORD.test(trimmedValue)) {
          error = validationMessage.PASSWORD_MUST_BE;
        }
        break;
        
      case 'confirmPassword':
        if (!trimmedValue) {
          error = validationMessage.CONFIRM_PASSWORD_REQUIRED;
        } else if (trimmedValue !== userData.password) {
          error = validationMessage.PASSWORD_MISMATCH;
        }
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateAllFields = () => {
    const fields = ['username', 'email', 'phoneNumber', 'password', 'confirmPassword'];
    let isValid = true;
    
    fields.forEach(field => {
      const valid = validateField(field, userData[field]);
      if (!valid) isValid = false;
    });
    
    return isValid;
  };

  const handleSignUp = () => {
    if (!validateAllFields()) return;

    // Create new user
    const newUser = {
      username: userData.username.trim(),
      email: userData.email.trim(),
      phoneNumber: userData.phoneNumber.trim(),
      passwordHash: userData.password, // In real app, hash this password
    };

    dispatch(registerUser(newUser));
    navigation.dispatch(
    CommonActions.reset({
        index: 0,
        routes: [
        { name: 'SignInScreen', params: { successMessage: 'Registration successful! Please login' } },
        ],
    })
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
    <View style={styles.container}>
        <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.mainContainer}>
            <Text style={styles.title}>Create Account</Text>

            <InputFields
                label="Username"
                value={userData.username}
                onChangeText={value => handleChange('username', value)}
                onBlur={() => validateField('username', userData.username)}
                error={errors.username}
                maxLength={20}
                placeholder="Enter username"
            />

            <InputFields
                label="Email"
                value={userData.email}
                keyboardType="email-address"
                onChangeText={value => handleChange('email', value)}
                onBlur={() => validateField('email', userData.email)}
                error={errors.email}
                placeholder="Enter email"
            />

            <InputFields
                label="Phone Number"
                value={userData.phoneNumber}
                keyboardType="phone-pad"
                onChangeText={value => handleChange('phoneNumber', value)}
                onBlur={() => validateField('phoneNumber', userData.phoneNumber)}
                error={errors.phoneNumber}
                maxLength={10}
                placeholder="Enter 10-digit phone number"
            />

            <InputFields
                label="Password"
                value={userData.password}
                secureTextEntry={secureText.password}
                onChangeText={value => handleChange('password', value)}
                onBlur={() => validateField('password', userData.password)}
                error={errors.password}
                iconSource={secureText.password ? eyeClose : eyeOpen}
                onIconPress={() => toggleSecureEntry('password')}
                placeholder="Enter password"
            />

            <InputFields
                label="Confirm Password"
                value={userData.confirmPassword}
                secureTextEntry={secureText.confirmPassword}
                onChangeText={value => handleChange('confirmPassword', value)}
                onBlur={() => validateField('confirmPassword', userData.confirmPassword)}
                error={errors.confirmPassword}
                iconSource={secureText.confirmPassword ? eyeClose : eyeOpen}
                onIconPress={() => toggleSecureEntry('confirmPassword')}
                placeholder="Confirm password"
            />

            <BlueButton
                label="Sign Up"
                onPress={handleSignUp}
                containerStyle={styles.buttonContainer}
            />

            <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
                <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink}>Login</Text>
                </Text>
            </TouchableOpacity>
        </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  logoContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
    color: COLORS.headerLabel,
  },
  buttonContainer: {
    marginTop: 20,
  },
  loginText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.textSecondary,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
