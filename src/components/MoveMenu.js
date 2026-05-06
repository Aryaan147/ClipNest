import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal as RNModal, TouchableWithoutFeedback } from 'react-native';
import { Colors, Fonts, Radius } from '../constants/theme';

export default function MoveMenu({ visible, onClose, availableFolders, onSelectFolder }) {
  // Center it in mobile instead of trying to tether to the button to avoid dealing with measure() flakiness
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.menu}>
              {availableFolders.length > 0 ? (
                availableFolders.map(folder => (
                  <TouchableOpacity key={folder} style={styles.menuItem} onPress={() => onSelectFolder(folder)}>
                    <Text style={styles.menuText}>{folder}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.menuItem}>
                  <Text style={[styles.menuText, { color: Colors.textFaint }]}>No other folders</Text>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menu: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.lg,
    minWidth: 200,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 10,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderStrong,
  },
  menuText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontFamily: Fonts.mono,
  },
});
