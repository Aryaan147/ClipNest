import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal as RNModal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors, Fonts, Radius } from '../constants/theme';

export default function ClipModal({ visible, onClose, onSave, folders, initialData }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folder, setFolder] = useState('');

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setTitle(initialData.title || '');
        setContent(initialData.content || '');
        setFolder(initialData.folder || folders[0] || 'All');
      } else {
        setTitle('');
        setContent('');
        setFolder(folders[0] || 'All');
      }
    }
  }, [visible, initialData, folders]);

  const handleSave = () => {
    const t = title.trim();
    const c = content.trim();
    if (t === '' || c === '') {
      return; // could show toast here, but returning mirrors web simple validation
    }
    onSave({ title: t, content: c, folder });
  };

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{initialData ? 'Edit Clip' : 'New Clip'}</Text>
            <TouchableOpacity style={styles.actionBtn} onPress={onClose}>
              <Text style={styles.actionBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>TITLE</Text>
              <TextInput
                style={styles.input}
                placeholder="Give this clip a name..."
                placeholderTextColor={Colors.textFaint}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>CONTENT</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Paste or type your content here..."
                placeholderTextColor={Colors.textFaint}
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>FOLDER</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={folder}
                  onValueChange={setFolder}
                  style={styles.picker}
                  dropdownIconColor={Colors.textMuted}
                >
                  {folders.map(f => (
                    <Picker.Item key={f} label={f} value={f} color={Platform.OS === 'ios' ? Colors.text : undefined} />
                  ))}
                </Picker>
              </View>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.ghostBtn} onPress={onClose}>
              <Text style={styles.ghostBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
              <Text style={styles.primaryBtnText}>{initialData ? 'Update Clip' : 'Save Clip'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.xxl,
    padding: 28,
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  actionBtn: {
    backgroundColor: Colors.border,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radius.sm,
  },
  actionBtnText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontFamily: Fonts.mono,
  },
  body: {
    flexGrow: 0,
    marginBottom: 14,
  },
  formGroup: {
    marginBottom: 14,
    gap: 6,
  },
  label: {
    fontSize: 11,
    color: Colors.textDim,
    letterSpacing: 1,
    fontFamily: Fonts.mono,
  },
  input: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 13,
    borderRadius: Radius.lg,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  textarea: {
    minHeight: 120,
  },
  pickerContainer: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  picker: {
    color: Colors.text,
    height: 48,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  ghostBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: Radius.lg,
  },
  ghostBtnText: {
    color: Colors.textMuted,
    fontFamily: Fonts.mono,
    fontSize: 13,
  },
  primaryBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: Radius.lg,
  },
  primaryBtnText: {
    color: Colors.bg,
    fontFamily: Fonts.mono,
    fontSize: 13,
    fontWeight: '500',
  },
});
