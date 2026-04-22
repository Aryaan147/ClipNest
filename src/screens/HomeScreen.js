import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ClipCard from '../components/ClipCard';
import ClipModal from '../components/ClipModal';
import MoveMenu from '../components/MoveMenu';
import Toast from '../components/Toast';
import { loadData, saveData } from '../storage/storage';
import { Colors, Fonts, Radius } from '../constants/theme';

const INITIAL_CLIPS = [
  { id: '1', title: 'ChatGPT Rewrite Prompt', content: 'Rewrite the following text in a clearer, more concise way while preserving the original meaning:', folder: 'AI Prompts', date: Date.now() - 86400000 },
  { id: '2', title: 'React useEffect Template', content: 'useEffect(() => {\n  // do something\n  return () => {\n    // cleanup\n  };\n}, []);', folder: 'Code Snippets', date: Date.now() - 172800000 },
  { id: '3', title: 'Research Paper Structure', content: 'Abstract → Introduction → Literature Review → Methodology → Results → Discussion → Conclusion', folder: 'Research', date: Date.now() - 259200000 }
];

const INITIAL_FOLDERS = ["AI Prompts", "Code Snippets", "Research", "Personal Notes"];

export default function HomeScreen() {
  const [clips, setClips] = useState(INITIAL_CLIPS);
  const [folders, setFolders] = useState(INITIAL_FOLDERS);
  
  const [currentFolder, setCurrentFolder] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClip, setEditingClip] = useState(null);
  
  const [moveMenuVisible, setMoveMenuVisible] = useState(false);
  const [movingClipId, setMovingClipId] = useState(null);
  
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  
  const [isSidebarVisible, setIsSidebarVisible] = useState(Dimensions.get('window').width > 700);

  useEffect(() => {
    const initData = async () => {
      const data = await loadData();
      if (data.clips) setClips(data.clips);
      if (data.folders) setFolders(data.folders);
    };
    initData();

    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setIsSidebarVisible(window.width > 700);
    });
    return () => sub?.remove();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleSaveClip = (clipData) => {
    let newClips;
    if (editingClip) {
      newClips = clips.map(c => c.id === editingClip.id ? { ...c, ...clipData } : c);
      showToast('Clip updated!');
    } else {
      newClips = [{ id: Date.now().toString(), date: Date.now(), ...clipData }, ...clips];
      showToast('Clip saved!');
    }
    setClips(newClips);
    saveData(newClips, folders);
    setModalVisible(false);
  };

  const handleDeleteClip = (id) => {
    const newClips = clips.filter(c => c.id !== id);
    setClips(newClips);
    saveData(newClips, folders);
    showToast('Clip deleted.');
  };

  const handleMoveClip = (folder) => {
    const newClips = clips.map(c => c.id === movingClipId ? { ...c, folder } : c);
    setClips(newClips);
    saveData(newClips, folders);
    setMoveMenuVisible(false);
    showToast('Moved to ' + folder);
  };

  const handleAddFolder = (name) => {
    if (folders.includes(name)) {
      showToast('That folder already exists.');
      return;
    }
    const newFolders = [...folders, name];
    setFolders(newFolders);
    saveData(clips, newFolders);
    showToast(`Folder "${name}" created!`);
  };

  const filteredClips = useMemo(() => {
    return clips.filter(clip => {
      const matchesFolder = currentFolder === 'All' || clip.folder === currentFolder;
      const q = searchQuery.toLowerCase();
      const matchesSearch = clip.title.toLowerCase().includes(q) || clip.content.toLowerCase().includes(q);
      return matchesFolder && matchesSearch;
    });
  }, [clips, currentFolder, searchQuery]);

  return (
    <View style={styles.container}>
      <Header 
        onNewClip={() => { setEditingClip(null); setModalVisible(true); }} 
      />
      
      {/* Mobile Sidebar Toggle */}
      {!isSidebarVisible && (
        <View style={styles.mobileNav}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['All', ...folders].map(f => (
              <TouchableOpacity key={f} style={[styles.mobilePill, currentFolder === f && styles.mobilePillActive]} onPress={() => setCurrentFolder(f)}>
                <Text style={[styles.mobilePillText, currentFolder === f && styles.mobilePillTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.appBody}>
        {isSidebarVisible && (
          <Sidebar 
            folders={folders} 
            clips={clips} 
            currentFolder={currentFolder} 
            onFolderSelect={setCurrentFolder} 
            onAddFolder={handleAddFolder} 
          />
        )}
        
        <View style={styles.main}>
          <View style={styles.searchWrap}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput 
              style={styles.searchInput}
              placeholder="Search clips..."
              placeholderTextColor={Colors.textFaint}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{currentFolder}</Text>
            <Text style={styles.clipCountLabel}>{filteredClips.length} clip{filteredClips.length !== 1 ? 's' : ''}</Text>
          </View>

          {filteredClips.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyGlyph}>⌗</Text>
              <Text style={styles.emptyMsg}>{searchQuery ? 'No clips match your search' : 'No clips here yet'}</Text>
              <Text style={styles.emptySub}>{searchQuery ? 'Try a different keyword' : 'Click "+ New Clip" to get started'}</Text>
            </View>
          ) : (
            <FlatList
              data={filteredClips}
              keyExtractor={item => item.id}
              numColumns={isSidebarVisible ? 2 : 1}
              key={isSidebarVisible ? '2col' : '1col'}
              columnWrapperStyle={isSidebarVisible ? { justifyContent: 'space-between' } : undefined}
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <ClipCard
                  clip={item}
                  onEdit={(id) => { setEditingClip(clips.find(c => c.id === id)); setModalVisible(true); }}
                  onDelete={handleDeleteClip}
                  onMove={(id) => { 
                    setMovingClipId(id); 
                    setMoveMenuVisible(true);
                  }}
                  onShowToast={showToast}
                />
              )}
            />
          )}
        </View>
      </View>

      <ClipModal
        visible={modalVisible}
        initialData={editingClip}
        folders={folders}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveClip}
      />

      <MoveMenu
        visible={moveMenuVisible}
        onClose={() => setMoveMenuVisible(false)}
        availableFolders={folders.filter(f => f !== clips.find(c => c.id === movingClipId)?.folder)}
        onSelectFolder={handleMoveClip}
      />

      <Toast visible={toastVisible} message={toastMsg} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  appBody: {
    flex: 1,
    flexDirection: 'row',
  },
  main: {
    flex: 1,
    padding: 24,
  },
  searchWrap: {
    position: 'relative',
    marginBottom: 24,
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
    color: Colors.textFaint,
    fontSize: 16,
    fontFamily: Fonts.mono,
  },
  searchInput: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 13,
    borderRadius: Radius.lg,
    paddingVertical: 10,
    paddingRight: 14,
    paddingLeft: 36,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  clipCountLabel: {
    fontSize: 12,
    color: Colors.textFaint,
    fontFamily: Fonts.mono,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyGlyph: {
    fontSize: 48,
    color: Colors.textDeep,
    marginBottom: 16,
  },
  emptyMsg: {
    fontSize: 14,
    color: Colors.textFaint,
    marginBottom: 4,
    fontFamily: Fonts.mono,
  },
  emptySub: {
    fontSize: 12,
    color: Colors.textGhost,
    fontFamily: Fonts.mono,
  },
  mobileNav: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  mobilePill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  mobilePillActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.border,
  },
  mobilePillText: {
    color: Colors.textMuted,
    fontFamily: Fonts.mono,
    fontSize: 12,
  },
  mobilePillTextActive: {
    color: Colors.accent,
  }
});
