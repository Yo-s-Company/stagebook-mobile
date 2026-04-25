import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, useColorScheme, View } from 'react-native';

interface LoadingOverlayProps {
    visible: boolean;
    message?: string;
}

export const LoadingOverlay = ({ visible, message = "CARGANDO..." }: LoadingOverlayProps) => {
    const isDark = useColorScheme() === 'dark';
    
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
                    <ActivityIndicator size="large" color="#9e0000" />
                    <Text style={[styles.text, { color: isDark ? '#ded1b8' : '#18181b' }]}>
                        {message}
                    </Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        gap: 15,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
    }
});