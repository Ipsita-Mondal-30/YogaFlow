import React from 'react';
import { TouchableOpacity, StyleSheet, Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/colors';

export default function ProfileButton() {
  const { user } = useUser();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.profileButton}
      onPress={() => (navigation as any).navigate('Profile')}
    >
      {user?.imageUrl ? (
        <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
      ) : (
        <View style={styles.profilePlaceholder}>
          <Ionicons name="person" size={20} color={colors.white} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.primary,
    zIndex: 1000,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profilePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
