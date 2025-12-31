// components/ThemedText.tsx
import { Text, TextProps } from 'react-native';

export function MyText({ className, children, ...props }: TextProps) {
  return (
    <Text 
      // Aplicamos la fuente mono (Courier) y el color de tu global.css por defecto
      className={`font-mono text-foreground ${className}`} 
      {...props}
    >
      {children}
    </Text>
  );
}