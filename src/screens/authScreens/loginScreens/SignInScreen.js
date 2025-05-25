import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import logo from '../../../assets/AppLogo.jpg';
import eyeClose from '../../../assets/eyeClose.jpg';
import eyeOpen from '../../../assets/eyeOpen.jpg';
import { COLORS } from '../../../styles/theme';
import InputFields from '../../../sharedComponents/InputFields';
import { generalConst, regex, validationMessage } from '../../../constants/appConstants';
import { BlueButton } from '../../../sharedComponents/BlueButton';
import { loginSuccess } from '../../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

const SignInScreen = ({ navigation, route }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [userCred, setUserCred] = useState({email:'', password:''});
  const [error, setError] = useState({email:null, password:null});
  const [secureText, setSecureText] = useState(true);
  const dispatch = useDispatch();
  const users = useSelector(state => state.users.entities);

  useEffect(() => {
    if (route.params?.successMessage) {
      setSuccessMessage(route.params.successMessage);
      const timer = setTimeout(() => {
        setSuccessMessage('');
        navigation.setParams({ successMessage: undefined });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [route.params]);

  const toggleSecureEntry = () => {
    setSecureText(!secureText);
  };

  const handleChange = (field, value) => {
    const trimmedValue = value.replace(/\s+/g, '');
    setUserCred(prev => ({ ...prev, [field]: field === 'email' ? trimmedValue.toLowerCase() : trimmedValue }));
    setError(prev => ({ ...prev, [field]: null }));
  };

  const validateInputs = (field, value) => {

    const newErrors = { ...error };

    if (!field || field === generalConst.EMAIL) {
      const emailValue = value || userCred.email;
      if (!emailValue) {
        newErrors.email = validationMessage.EMAIL_IS_REQUIRED;
      } else if (!regex.EMAIL.test(emailValue)) {
        newErrors.email = validationMessage.IVALID_EMAIL_FORMAT;
      } else {
        delete newErrors.email;

      }
    }
    if (!field || field === generalConst.PASSWORD) {
      const passwordValue = value || userCred.password;
      if (!passwordValue) {
        newErrors.password = validationMessage.PASSWORD_IS_REQUIRED;
      } else if (!regex.PASSWORD.test(passwordValue)) {
        newErrors.password = validationMessage.PASSWORD_MUST_BE;
      } else {
        delete newErrors.password;
      }
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = () => {
    if (!validateInputs()) return;

    // Find user by email
    const user = Object.values(users).find(
      u => u.email === userCred.email.toLowerCase().trim()
    );

    if (!user) {
      setError(prev => ({
        ...prev,
        email: 'User not found with this email'
      }));
      return;
    }

    // Compare passwords (in real app, compare hashed passwords)
    if (user.passwordHash !== userCred.password) {
      setError(prev => ({
        ...prev,
        password: 'Incorrect password'
      }));
      return;
    }

    // Successful login
    dispatch(loginSuccess(user));
    navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [
            { name: 'Home'},
            ],
        })
    );
    
    // Clear credentials if needed
    setUserCred({ email: '', password: '' });
    setError({ email: null, password: null });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
     <View style={styles.container} >
      {successMessage && (
        <View style={styles.successMessageContainer}>
        <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>
      <View style={styles.mainContainer}>
      <Text style={styles.title}>{'Sign In'}</Text>

      <InputFields 
            label={'Email'}
            value={userCred.email}
            keyboardType={'email-address'}
            onFocus={() => {
              setError(prev => ({...prev, email:null}));
            }} 
            onBlur={() => validateInputs(generalConst.EMAIL, userCred.email)}
            onChangeText={value => handleChange(generalConst.EMAIL, value)}
            secureTextEntry={false}
            editable={true}
            maxLength={50}
            placeholder={"Enter Email"}
            error={error?.email}
        />

        <InputFields 
            label={"Password"} 
            value={userCred.password} 
            keyboardType={"default"}
            onFocus={() => {setError(prev => ({...prev, password:null}));}} 
            onBlur={() => validateInputs(generalConst.PASSWORD, userCred.password)}
            onChangeText={value => handleChange(generalConst.PASSWORD, value)}
            onIconPress={toggleSecureEntry}
            iconSource={secureText ? eyeClose : eyeOpen}
            editable={true}
            secureTextEntry={secureText}
            maxLength={20}
            placeholder={"Enter Password"}
            error={error?.password}
        />

      <BlueButton
        label={"Sign In"}
        onPress={handleSignIn}
        containerStyle={styles.buttonContainer}
      />

      <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
        <Text style={styles.registerText}>
          Dont't have an account? <Text style={styles.registerLink}>Register</Text>
        </Text>
      </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  )
}

export default SignInScreen;

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
  buttonContainer:{
    marginTop:10,
  },
  logoContainer: {
    alignItems: 'flex-end',
    marginBottom: 30,
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  registerText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.textSecondary,
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  successMessageContainer: {
    // marginBottom: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.green,
    borderRadius: 8,
  },
  successText: {
    color: COLORS.background,
    textAlign: 'center',
    // marginBottom: 16,
  },
});
