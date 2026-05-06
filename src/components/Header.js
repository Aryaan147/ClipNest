import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Fonts, Radius } from '../constants/theme';

export default function Header({ onNewClip }) {
  return (
    <View style={styles.header}>
      <View style={styles.logo}>
        <Text style={styles.logoIcon}>⌗</Text>
        <Text style={styles.logoText}>ClipNest</Text>
        <Text style={styles.logoVersion}>v1.0</Text>
      </View>
      <TouchableOpacity style={styles.primaryBtn} onPress={onNewClip} activeOpacity={0.8}>
        <Text style={styles.primaryBtnText}>+ New Clip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.bg,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    fontSize: 22,
    color: Colors.accent,
  },
  logoText: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  logoVersion: {
    fontSize: 11,
    color: Colors.textFaint,
    fontFamily: Fonts.mono,
  },
  primaryBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: Radius.lg,
  },
  primaryBtnText: {
    color: Colors.bg,
    fontFamily: Fonts.mono,
    fontSize: 13,
    fontWeight: '500',
  },
});
