import { Text, TextProps, useColorScheme } from "react-native";

export function MyText({ style, className, children, ...props }: TextProps & { className?: string }) {
  const scheme = useColorScheme();

  return (
    <Text
      {...props}
      className={`font-mono ${className || ""}`}
      style={[
        { color: scheme === "dark" ? "#ffffff" : "#000000" },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
