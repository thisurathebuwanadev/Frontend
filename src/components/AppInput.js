import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "../theme/colors";

export function AppInput({ leftIcon, style, ...props }) {
  return (
    <View style={styles.container}>
      {leftIcon ? <View style={styles.iconContainer}>{leftIcon}</View> : null}
      <TextInput
        placeholderTextColor={colors.placeholderText}
        style={[styles.input, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 999,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  iconContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.textOnDark,
    paddingVertical: 10,
    fontSize: 15,
  },
});

export default AppInput;

