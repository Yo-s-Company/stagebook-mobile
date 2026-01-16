import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  avatarUrl: string | null;
}

export const Header: React.FC<HeaderProps> = ({ avatarUrl }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top, height: 60 + insets.top, backgroundColor: '#f80000' }]}>
      <View style={styles.headerTitleContainer}>
        <Image 
          source={require('../../assets/images/LogoEditado.png')} 
          style={styles.logo} 
          resizeMode="contain" 
        />
        <View style={styles.brandContainer}>
          <Text style={styles.brandStage}>Stage</Text>
          <Text style={styles.brandBook}>Book</Text>
        </View>
      </View>

<TouchableOpacity
  onPress={() => {
    console.log("Avatar presionado!");
    router.push('/(app)/profile'); // Ahora apunta al Stack Screen llamado "Profile"
  }}
  activeOpacity={0.7}
>
  <Image 
    source={{ uri: avatarUrl || 'https://via.placeholder.com/150' }} 
    style={styles.avatar} 
  />
</TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: { width: 40, height: 40 },
  brandContainer: { flexDirection: 'row', alignItems: 'center' },
  brandStage: { fontWeight: 'bold', fontSize: 18, color: '#FFFFFF' },
  brandBook: { fontWeight: 'bold', fontSize: 18, color: '#000000' },
  avatar: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#fff' 
  },
});
