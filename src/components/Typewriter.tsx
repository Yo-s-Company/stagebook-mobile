import { MyText } from "@/src/components/ThemedText";
import { useIsFocused } from "@react-navigation/native"; // Importante: detecta si la pantalla está activa
import React, { useEffect, useState } from "react";
import { StyleProp, TextStyle, View } from "react-native";

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  style?: StyleProp<TextStyle>;
}

export default function Typewriter({ text, speed = 100, className = "", style }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const isFocused = useIsFocused(); // Hook que devuelve true si la pantalla está visible

  useEffect(() => {
    // Si la pantalla no está enfocada, limpiamos el texto y no hacemos nada
    if (!isFocused) {
      setDisplayedText("");
      return;
    }

    let i = 0;
    setDisplayedText(""); // Reiniciamos el texto al ganar el foco

    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;

      if (i >= text.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, isFocused]); // Se reinicia si cambia el texto, la velocidad o si la pantalla vuelve a enfocarse

  return (
    <View className={`flex-row items-center flex-wrap ${className}`}>
      <MyText style={style} className={className}>
        {displayedText}
      </MyText>
    </View>
  );
}