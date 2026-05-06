import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors, Fonts, Radius } from '../constants/theme';

export default function ClipCard({ clip, onEdit, onDelete, onMove, onShowToast }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeout;
    if (copied) {
      timeout = setTimeout(() => setCopied(false), 1500);
    }
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(clip.content);
    setCopied(true);
    onShowToast('Copied to clipboard!');
  };

  const timeAgo = (timestamp) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    return Math.floor(diff / 86400000) + 'd ago';
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.title} numberOfLines={1}>{clip.title}</Text>
        <View style={styles.tagWrap}>
          <Text style={styles.tag}>{clip.folder}</Text>
        </View>
      </View>
      
      <Text style={styles.preview} numberOfLines={3}>{clip.content}</Text>
      
      <View style={styles.footer}>
        <Text style={styles.time}>{timeAgo(clip.date)}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={(e) => onMove(clip.id, e)} activeOpacity={0.5}>
            <Text style={styles.actionIcon}>⇄</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit(clip.id)} activeOpacity={0.5}>
            <Text style={styles.actionIcon}>✎</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, copied && styles.actionBtnSuccess]} onPress={handleCopy} activeOpacity={0.5}>
            <Text style={[styles.actionIcon, copied && { color: Colors.success }]}>{copied ? '✓' : '⎘'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnDanger} onPress={() => onDelete(clip.id)} activeOpacity={0.5}>
            <Text style={styles.actionIconDanger}>⌫</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderMid,
    borderRadius: Radius.xl,
    padding: 18,
    flex: 1,
    margin: 7, // half of gap 14
    minWidth: 260,
    maxWidth: Dimensions.get('window').width > 600 ? '48%' : '100%',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    fontFamily: Fonts.mono,
  },
  tagWrap: {
    backgroundColor: Colors.borderMid,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  tag: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: Fonts.mono,
  },
  preview: {
    fontSize: 12,
    color: Colors.textDim,
    lineHeight: 19, // 12 * 1.6
    fontFamily: Fonts.mono,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  time: {
    fontSize: 11,
    color: Colors.textGhost,
    fontFamily: Fonts.mono,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    backgroundColor: Colors.border,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnSuccess: {
    borderColor: Colors.success,
  },
  actionBtnDanger: {
    backgroundColor: Colors.border,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    color: Colors.textMuted,
    fontSize: 12,
    fontFamily: Fonts.mono,
  },
  actionIconDanger: {
    color: '#e05a3a', // simulate hover danger state for mobile
    fontSize: 12,
    fontFamily: Fonts.mono,
  }
});
