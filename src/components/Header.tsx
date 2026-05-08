import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  avatarUrl: string | null;
}

export const Header: React.FC<HeaderProps> = ({ avatarUrl }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const shadowColor = isDark ? '#121212' : '#dedede';
  const mainRed = isDark ? '#9d0000' : '#dc2626'
  const book = isDark ? '#D4AF37' : '#dc2626'

  const logoSource = isDark 
    ? require('../../assets/images/LogoEditado.png')
    : require('../../assets/images/logo.png')
    

return (
    // Reemplazamos el View principal por LinearGradient
    <LinearGradient
      // Colores: Rojo principal -> Rojo más oscuro o translúcido para el degradado
      colors={[mainRed, shadowColor]} 
        start={{ x: 0.5, y: 0 }} 
        end={{ x: 0.5, y: 1 }}
        style={[
          styles.headerContainer, 
          { 
            paddingTop: insets.top, 
            height: 110 + insets.top 
          }
        ]}
    >
      {/* 1. LADO IZQUIERDO: LOGO Y MARCA */}
      <View style={styles.headerTitleContainer}>
        <Image 
          source={logoSource} 
          style={styles.logo} 
          resizeMode="contain" 
        />
        <View style={styles.brandContainer}>
          <Text style={styles.brandStage}>Stage</Text>
          <Text style={[styles.brandBook, {color: book}]}>Book</Text>
        </View>
      </View>

{/* 2. LADO DERECHO: CONTENEDOR DE ACCIONES */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          onPress={() => router.push('/(auth)/notifications')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => router.push('/perfilScreen')}
          activeOpacity={0.7}
        >
          <Image 
            source={{ uri: avatarUrl || 'https://via.placeholder.com/150' }} 
            style={styles.avatar} 
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
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
  logo: { width: 60, height: 60 },
  brandContainer: { flexDirection: 'row', alignItems: 'center' },
  brandStage: { fontWeight: 'bold', fontSize: 20, color: '#FFFFFF' },
  brandBook: { fontWeight: 'bold', fontSize: 20 },
  avatar: { 
    width: 34, 
    height: 32, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#00c8cf' 
  },
  actionsContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 16, 
  },

});
