import { MyText } from "@/src/components/ThemedText";
import React, { useEffect, useState } from "react";
import { StyleProp, TextStyle, View } from "react-native";

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  style?: StyleProp<TextStyle>;
}

export default function Typewriter({ text, speed = 100, className = "" }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    setIsFinished(false);

    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;

      if (i >= text.length) {
        clearInterval(timer);
        setIsFinished(true);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    // flex-row garantiza que el cursor esté a la derecha del texto
    // items-center alinea el cursor verticalmente con las letras
    <View className={`flex-row items-center flex-wrap ${className}`}>
      <MyText className={className}>
        {displayedText}
      </MyText>
    </View>
  );
}