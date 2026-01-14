import { Platform, Vibration } from 'react-native';

/**
 * Vibración de error (patrón corto y notorio)
 */
export const vibrateError = () => {
  const pattern = Platform.OS === 'ios'
    ? 50
    : [0, 60, 40, 60];

  Vibration.vibrate(pattern);
};

/**
 * Vibración de éxito (más sutil)
 */
export const vibrateSuccess = () => {
  const pattern = Platform.OS === 'ios'
    ? 30
    : [0, 30];

  Vibration.vibrate(pattern);
};

/**
 * Vibración de advertencia
 */
export const vibrateWarning = () => {
  const pattern = Platform.OS === 'ios'
    ? 40
    : [0, 40, 30, 40];

  Vibration.vibrate(pattern);
};
