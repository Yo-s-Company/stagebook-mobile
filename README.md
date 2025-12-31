# 🎭 StageBook Mobile

**StageBook** es una plataforma diseñada para artistas, enfocada en ofrecer una experiencia visual minimalista y de alto rendimiento utilizando **React Native** y **Expo Router**.

## 🚀 Tecnologías Principales

* **Framework:** [Expo](https://expo.dev/) (SDK 51+)
* **Navegación:** [Expo Router](https://docs.expo.dev/router/introduction/) (Basado en archivos)
* **Estilos:** [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS para Native)
* **Animaciones:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
* **Tipografía:** Courier / Monospace (Sistema) para una estética de terminal técnica.

## 📂 Estructura de Rutas

El proyecto utiliza **Route Groups** para separar la lógica de acceso:

- `app/index.tsx`: Pantalla de bienvenida (Splash Screen personalizado de 5s).
- `app/(auth)/`: Módulo de autenticación (Login y Registro).
- `app/(app)/`: Módulo principal de la aplicación protegida.
- `app/modal.tsx`: Pantalla de presentación modal para utilidades rápidas.

## 🎨 Sistema de Diseño

Hemos implementado un sistema de temas basado en variables CSS en `global.css`:

- **Modo Claro:** Fondo Platino (`#E5E4E2`) con acentos rojos.
- **Modo Oscuro:** Fondo Negro puro (`#000000`) para pantallas OLED.
- **Componentes Tematizados:** Uso de `MyText` para garantizar la fuente mono y colores dinámicos en toda la app.

## 🛠️ Instalación y Uso

1. Instalar dependencias:
   npm install

2. Iniciar el proyecto
   npx expo start -c