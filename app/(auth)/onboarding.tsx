import { MyText } from '@/src/components/ThemedText';
import { vibrateError } from '@/src/components/vibration';
import { supabase } from '@/src/lib/supabase';
import { decode } from 'base64-arraybuffer';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFullName(user.user_metadata?.full_name || user.user_metadata?.display_name || '');
      }
    };
    getUserData();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true, 
      });

      if (!result.canceled && result.assets && result.assets[0].base64) {
        setUploading(true);
        const file = result.assets[0];
        const base64Data = file.base64 as string;
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No hay sesión activa");

        const fileExt = file.uri.split('.').pop();
        const filePath = `${user.id}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, decode(base64Data), {
            contentType: `image/${fileExt}`,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        setAvatarUrl(publicUrl);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo subir la foto artística');
    } finally {
      setUploading(false);
    }
  };

  const handleFinish = async () => {
    if (!username.trim()) {
      vibrateError();
      Alert.alert("Reparto Incompleto", "Debes elegir un @username para que se te reconozca en el elenco.");
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('profiles')
      .update({ 
        username: username.toLowerCase().trim(), 
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date() 
      })
      .eq('id', user?.id);

    if (!error) {
      router.replace('../(app)/ActiveSummaryScreen'); 
    } else {
      Alert.alert("Error de Registro", "Ese @username ya está ocupado. Elige otro para tu marquesina.");
      setLoading(false);
    }
  };

  const dynamicBg = isDark ? '#000000' : '#F4F4F5';
  const dynamicCard = isDark ? 'rgba(24, 24, 27, 0.5)' : '#FFFFFF';
  const dynamicText = isDark ? '#FFFFFF' : '#000000';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: dynamicBg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex1}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.titleContainer}>
            <MyText style={[styles.title, { color: dynamicText }]}>
              Prepara tu <MyText style={styles.textRed}>Camerino</MyText>
            </MyText>
            <MyText style={styles.subtitle}>
              Personaliza tu ficha artística
            </MyText>
          </View>

          <View style={[styles.card, { backgroundColor: dynamicCard, borderColor: isDark ? '#27272a' : '#e4e4e7' }]}>
            {/* Avatar Selector */}
            <TouchableOpacity 
              onPress={pickImage}
              disabled={uploading}
              style={[
                styles.avatarBtn,
                { borderColor: avatarUrl ? '#7C3AED' : '#3f3f46', borderStyle: avatarUrl ? 'solid' : 'dashed' }
              ]}
            >
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  {uploading ? (
                    <ActivityIndicator color="#7C3AED" />
                  ) : (
                    <MyText style={styles.uploadText}>Subir Foto</MyText>
                  )}
                </View>
              )}
            </TouchableOpacity>

            {/* Inputs */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <MyText style={styles.label}>Nombre Público</MyText>
                <TextInput 
                  value={fullName}
                  onChangeText={setFullName}
                  placeholderTextColor="#52525b"
                  style={[styles.input, { color: dynamicText }]}
                />
              </View>

              <View style={styles.inputGroup}>
                <MyText style={styles.label}>@Username</MyText>
                <TextInput 
                  placeholder="ej: el_protagonista"
                  placeholderTextColor="#52525b"
                  autoCapitalize="none"
                  onChangeText={setUsername}
                  style={[styles.input, styles.usernameInput]}
                />
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleFinish}
              disabled={loading || !username.trim() || uploading} 
              style={[
                styles.finishBtn,
                (!username.trim() || loading) ? styles.btnDisabled : styles.btnActive
              ]}
            >
              <MyText style={styles.finishBtnText}>
                {loading ? "GUARDANDO FICHA..." : "ENTRAR A ELENCO"}
              </MyText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  titleContainer: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: -1 },
  textRed: { color: '#dc2626' },
  subtitle: { color: '#71717a', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3, marginTop: 8, textAlign: 'center' },
  card: { padding: 32, borderRadius: 40, borderWidth: 1 },
  avatarBtn: { width: 128, height: 128, borderRadius: 64, alignSelf: 'center', borderWidth: 2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 32 },
  avatarImage: { width: '100%', height: '100%' },
  uploadPlaceholder: { alignItems: 'center' },
  uploadText: { fontSize: 10, color: '#71717a', textAlign: 'center', textTransform: 'uppercase' },
  form: { gap: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, color: '#71717a', marginLeft: 4, marginBottom: 8 },
  input: { borderBottomWidth: 1, borderBottomColor: '#27272a', paddingVertical: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  usernameInput: { color: '#dc2626', fontWeight: 'bold' },
  finishBtn: { width: '100%', paddingVertical: 20, borderRadius: 999, marginTop: 40, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
  btnActive: { backgroundColor: '#7C3AED' },
  btnDisabled: { backgroundColor: '#27272a' },
  finishBtnText: { color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, fontSize: 12 }
});