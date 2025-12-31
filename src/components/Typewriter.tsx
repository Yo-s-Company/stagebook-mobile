import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { MyText } from "./ThemedText"; // Tu componente Courier

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
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
      <MyText>
        {displayedText}
      </MyText>
    </View>
  );
}