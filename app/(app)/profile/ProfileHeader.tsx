import { HighlightItem, ProfileHeaderProps } from '@/src/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData, theme, onEdit }) => {
  
  const highlights: HighlightItem[] = [
    { id: 'habilidades', name: 'Habilidades', icon: 'star-outline' },
    { id: 'idiomas', name: 'Idiomas', icon: 'translate' },
    { id: 'formacion', name: 'Formación', icon: 'school-outline' },
    { id: 'companias', name: 'Compañías', icon: 'theater' },
  ];

  const socialLinks = [
    { name: 'instagram', icon: 'instagram' },
    { name: 'linkedin', icon: 'linkedin' },
    { name: 'web', icon: 'web' },
    { name: 'email', icon: 'email-outline' },
  ];

  return (
    <View style={styles.header}>
      {/* SECCIÓN 1: FOTO DE PERFIL */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: userData.avatar_url || 'https://via.placeholder.com/150' }} 
          style={[styles.avatar, { borderColor: theme.primary }]} 
        />
        <TouchableOpacity 
          style={[styles.cameraIcon, { backgroundColor: theme.primary }]}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="camera" size={14} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* SECCIÓN 2: INFO BÁSICA */}
      <Text style={[styles.name, { color: theme.text }]}>{userData.displayName}</Text>
      <Text style={[styles.username, { color: theme.primary }]}>@{userData.artisticName}</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>📍 {userData.birthPlace}</Text>
        <Text style={styles.infoText}>  |  🎂 {userData.age} años</Text>
      </View>

      {/* SECCIÓN 3: REDES SOCIALES */}
      <View style={styles.socialRow}>
        {socialLinks.map((link) => (
          <TouchableOpacity key={link.name} style={styles.socialIcon}>
            <MaterialCommunityIcons name={link.icon as any} size={20} color={theme.text} />
          </TouchableOpacity>
        ))}
        <TouchableOpacity 
          style={[styles.editSocialBtn, { backgroundColor: theme.text + '10' }]} 
          onPress={onEdit}
        >
          <MaterialCommunityIcons name="pencil-outline" size={12} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* SECCIÓN 4: DESCRIPCIÓN */}
      <Text style={[styles.bio, { color: theme.text }]} numberOfLines={3}>
        {userData.description}
      </Text>

      {/* SECCIÓN 5: BOTONES DE ACCIÓN */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.btn, { borderColor: theme.text + '40' }]} onPress={onEdit}>
          <Text style={[styles.btnText, { color: theme.text }]}>Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary, borderColor: theme.primary }]}>
          <Text style={styles.btnTextWhite}>Descargar Book</Text>
        </TouchableOpacity>
      </View>

      {/* SECCIÓN 6: HIGHLIGHTS (Mini iconos distribuidos) */}
      <View style={styles.highlightsWrapper}>
        <View style={styles.highlightsStaticRow}>
          {highlights.map((item) => (
            <TouchableOpacity key={item.id} style={styles.highlightItem}>
              <View style={[styles.highlightCircle, { borderColor: theme.primary + '30' }]}>
                <MaterialCommunityIcons name={item.icon as any} size={20} color={theme.primary} />
              </View>
              <Text style={[styles.highlightText, { color: theme.text }]}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    alignItems: 'center', 
    width: '100%',
    paddingTop: 1
  },
  imageContainer: { 
    position: 'relative', 
    marginBottom: 10,
    marginTop: 10 
  },
  avatar: { 
    width: 86, 
    height: 86, 
    borderRadius: 43, 
    borderWidth: 2 
  },
  cameraIcon: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    padding: 6, 
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff'
  },
  name: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    letterSpacing: -0.5 
  },
  username: { 
    fontWeight: '700', 
    fontSize: 14, 
    marginTop: 2 
  },
  infoRow: { 
    flexDirection: 'row', 
    marginTop: 4, 
    marginBottom: 12 
  },
  infoText: { 
    color: '#71717a', 
    fontSize: 11,
    fontWeight: '500'
  },
  socialRow: { 
    flexDirection: 'row', 
    gap: 12, 
    alignItems: 'center', 
    marginBottom: 15 
  },
  socialIcon: { 
    padding: 4 
  },
  editSocialBtn: { 
    marginLeft: 4, 
    padding: 5, 
    borderRadius: 6 
  },
  bio: { 
    textAlign: 'center', 
    paddingHorizontal: 40, 
    fontSize: 13, 
    lineHeight: 18, 
    marginBottom: 20,
    opacity: 0.8
  },
  buttonRow: { 
    flexDirection: 'row', 
    gap: 10, 
    width: '90%', 
    marginBottom: 25 
  },
  btn: { 
    flex: 1, 
    paddingVertical: 10, 
    borderRadius: 12, 
    borderWidth: 1, 
    alignItems: 'center' 
  },
  btnText: { 
    fontWeight: 'bold', 
    fontSize: 12 
  },
  btnTextWhite: { 
    fontWeight: 'bold', 
    fontSize: 12, 
    color: '#fff' 
  },
  highlightsWrapper: { 
    width: '100%', 
    paddingHorizontal: 10,
    marginTop: 10
  },
  highlightsStaticRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', // Los agrupamos al centro
    alignItems: 'flex-start',
    width: '100%',
    gap: 12 // Espacio fijo entre ellos para que no se corten
  },
  highlightItem: { 
    alignItems: 'center', 
    width: 75 // Ancho fijo en lugar de %
  },
  highlightCircle: { 
    width: 44, // Un poco más pequeños
    height: 44, 
    borderRadius: 22, 
    borderWidth: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 6, 
    backgroundColor: 'rgba(124, 58, 237, 0.04)' 
  },
  highlightText: { 
    fontSize: 8, // Texto más pequeño para evitar saltos
    fontWeight: '700', 
    textTransform: 'uppercase', 
    letterSpacing: 0.5,
    textAlign: 'center'
  }
});

export default ProfileHeader;