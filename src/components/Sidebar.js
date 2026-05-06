import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors, Fonts, Radius } from '../constants/theme';

export default function Sidebar({ folders, currentFolder, onFolderSelect, clips, onAddFolder }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const allCount = clips.length;

  const handleAdd = () => {
    const trimmed = newFolderName.trim();
    if (trimmed) {
      onAddFolder(trimmed);
      setNewFolderName('');
      setIsAdding(false);
    }
  };

  return (
    <View style={styles.sidebar}>
      <Text style={styles.sectionLabel}>LIBRARY</Text>
      
      <TouchableOpacity 
        style={[styles.folderItem, currentFolder === 'All' && styles.folderItemActive]}
        onPress={() => onFolderSelect('All')}
        activeOpacity={0.7}
      >
        <Text style={[styles.folderText, currentFolder === 'All' && styles.folderTextActive]}>All Clips</Text>
        <Text style={styles.folderCount}>{allCount}</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionLabel, { marginTop: 16 }]}>FOLDERS</Text>
      
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {folders.map(folder => {
          const count = clips.filter(c => c.folder === folder).length;
          const isActive = currentFolder === folder;
          return (
            <TouchableOpacity 
              key={folder}
              style={[styles.folderItem, isActive && styles.folderItemActive]}
              onPress={() => onFolderSelect(folder)}
              activeOpacity={0.7}
            >
              <Text style={[styles.folderText, isActive && styles.folderTextActive]}>{folder}</Text>
              <Text style={styles.folderCount}>{count}</Text>
            </TouchableOpacity>
          );
        })}

        {!isAdding ? (
          <TouchableOpacity style={styles.addFolderBtn} onPress={() => setIsAdding(true)} activeOpacity={0.7}>
            <Text style={styles.addFolderText}>+ New Folder</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.folderInputBox}>
            <TextInput
              style={styles.input}
              placeholder="Folder name..."
              placeholderTextColor={Colors.textFaint}
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus
              onSubmitEditing={handleAdd}
            />
            <View style={styles.inputActions}>
              <TouchableOpacity style={styles.primaryBtnSmall} onPress={handleAdd}>
                <Text style={styles.primaryBtnText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ghostBtnSmall} onPress={() => setIsAdding(false)}>
                <Text style={styles.ghostBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 220,
    backgroundColor: Colors.bg,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  sectionLabel: {
    fontSize: 10,
    color: Colors.textFaint,
    letterSpacing: 2,
    paddingLeft: 12,
    marginBottom: 8,
    fontFamily: Fonts.mono,
  },
  folderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    marginBottom: 2,
    borderLeftWidth: 2,
    borderLeftColor: 'transparent',
  },
  folderItemActive: {
    backgroundColor: Colors.border,
    borderLeftColor: Colors.accent,
    paddingLeft: 10,
  },
  folderText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontFamily: Fonts.mono,
  },
  folderTextActive: {
    color: Colors.accent,
  },
  folderCount: {
    fontSize: 11,
    color: Colors.textFaint,
    fontFamily: Fonts.mono,
  },
  addFolderBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    marginTop: 4,
  },
  addFolderText: {
    fontSize: 12,
    color: Colors.textFaint,
    fontFamily: Fonts.mono,
  },
  folderInputBox: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  input: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 13,
    borderRadius: Radius.lg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  inputActions: {
    flexDirection: 'row',
    gap: 6,
  },
  primaryBtnSmall: {
    backgroundColor: Colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.lg,
    flex: 1,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: Colors.bg,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '500',
  },
  ghostBtnSmall: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.lg,
    flex: 1,
    alignItems: 'center',
  },
  ghostBtnText: {
    color: Colors.textMuted,
    fontFamily: Fonts.mono,
    fontSize: 12,
  },
});
