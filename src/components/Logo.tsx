import React from 'react';
import { Image, ImageStyle } from 'react-native';

interface LogoProps {
  width?: number;
  style?: ImageStyle;
}

export const Logo: React.FC<LogoProps> = ({ width = 100, style }) => {
  return (
    <Image
      source={require('../../assets/images/logo.png')} 
      style={[{ width: width, height: width * 0.5 }, style]} 
      resizeMode="contain"
    />
  );
};

export default Logo;