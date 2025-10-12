import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSignUp, useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { colors } from '../utils/colors';
import TexturedBackground from '../components/TexturedBackground';
import GlassCard from '../components/GlassCard';
import { supabase } from '../services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

const { width, height } = Dimensions.get('window');

interface SignUpScreenProps {
  navigation: any;
}

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  useWarmUpBrowser();
  
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT');

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        // Save user role to Supabase and AsyncStorage
        const user = completeSignUp.createdUserId;
        if (user) {
          try {
            // Save to Supabase
            await supabase.from('users').insert({
              clerk_id: user,
              name: `${firstName} ${lastName}`.trim(),
              email: emailAddress,
              role: selectedRole.toLowerCase(),
            });
            
            // Save to AsyncStorage
            await AsyncStorage.setItem('userRole', selectedRole);
          } catch (error) {
            console.error('Error saving user role:', error);
          }
        }
        
        await setActive({ session: completeSignUp.createdSessionId });
      }
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignUp = async () => {
    try {
      setLoading(true);
      const { createdSessionId, setActive: oauthSetActive } = await startOAuthFlow();
      
      if (createdSessionId && oauthSetActive) {
        // For Google sign-up, we'll use the selected role from the form
        // Save role to AsyncStorage for immediate use
        await AsyncStorage.setItem('userRole', selectedRole);
        
        await oauthSetActive({ session: createdSessionId });
        console.log('Google sign up successful with role:', selectedRole);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Google sign up failed');
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <TexturedBackground variant="medium">
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Image 
                    source={require('../assets/yoga.png')} 
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.logoText}>Yoga Flow</Text>
                <Text style={styles.tagline}>Rishikesh to the World</Text>
              </View>
            </View>

            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>Verification Code</Text>
              <Text style={styles.welcomeSubtitle}>
                We've sent a verification code to {emailAddress}
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="key-outline" size={20} color={colors.gray} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter verification code"
                    placeholderTextColor={colors.textLight}
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.signInButton, loading && styles.disabledButton]}
                onPress={onPressVerify}
                disabled={loading || !code}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryLight]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Verifying...' : 'Verify Email'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.resendContainer}
                onPress={() => {
                  if (signUp) {
                    signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
                  }
                }}
              >
                <Text style={styles.resendText}>Didn't receive the code? </Text>
                <Text style={styles.resendLink}>Resend</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TexturedBackground>
    );
  }

  return (
    <TexturedBackground variant="medium">
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Image 
                  source={require('../assets/yoga.png')} 
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.logoText}>Yoga Flow</Text>
              <Text style={styles.tagline}>Rishikesh to the World</Text>
            </View>
          </View>

          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Create Account</Text>
            <Text style={styles.welcomeSubtitle}>
              Begin your yoga journey with us today
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.nameRow}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color={colors.gray} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="First name"
                    placeholderTextColor={colors.textLight}
                    value={firstName}
                    onChangeText={setFirstName}
                    autoComplete="given-name"
                  />
                </View>
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color={colors.gray} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Last name"
                    placeholderTextColor={colors.textLight}
                    value={lastName}
                    onChangeText={setLastName}
                    autoComplete="family-name"
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={colors.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor={colors.textLight}
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.gray} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Password"
                  placeholderTextColor={colors.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password-new"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={colors.gray} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Role Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.roleLabel}>I am a:</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    selectedRole === 'STUDENT' && styles.selectedRoleButton
                  ]}
                  onPress={() => setSelectedRole('STUDENT')}
                >
                  <Ionicons 
                    name="school-outline" 
                    size={20} 
                    color={selectedRole === 'STUDENT' ? colors.textWhite : colors.primary} 
                  />
                  <Text style={[
                    styles.roleButtonText,
                    selectedRole === 'STUDENT' && styles.selectedRoleButtonText
                  ]}>
                    Student
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    selectedRole === 'ADMIN' && styles.selectedRoleButton
                  ]}
                  onPress={() => setSelectedRole('ADMIN')}
                >
                  <Ionicons 
                    name="person-outline" 
                    size={20} 
                    color={selectedRole === 'ADMIN' ? colors.textWhite : colors.primary} 
                  />
                  <Text style={[
                    styles.roleButtonText,
                    selectedRole === 'ADMIN' && styles.selectedRoleButtonText
                  ]}>
                    Teacher
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.signInButton, loading && styles.disabledButton]}
              onPress={onSignUpPress}
              disabled={loading || !emailAddress || !password || !firstName || !lastName}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <Text style={styles.buttonText}>Creating Account...</Text>
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.socialButton} onPress={onGoogleSignUp}>
              <Ionicons name="logo-google" size={20} color={colors.error} />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.signUpLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TexturedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: -20,
    left: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 16,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 20,
  },
  halfWidth: {
    width: '48%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 16,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  signInButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.lightGray,
  },
  dividerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.lightGray,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 12,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 32,
  },
  signUpText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  resendText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  // Role selection styles
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  selectedRoleButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  selectedRoleButtonText: {
    color: colors.textWhite,
  },
});