import AsyncStorage from '@react-native-async-storage/async-storage';

const CLIPS_KEY = 'clipnest-clips';
const FOLDERS_KEY = 'clipnest-folders';

export async function loadData() {
  try {
    const savedClips = await AsyncStorage.getItem(CLIPS_KEY);
    const savedFolders = await AsyncStorage.getItem(FOLDERS_KEY);
    return {
      clips: savedClips ? JSON.parse(savedClips) : null,
      folders: savedFolders ? JSON.parse(savedFolders) : null,
    };
  } catch (e) {
    return { clips: null, folders: null };
  }
}

export async function saveData(clips, folders) {
  try {
    await AsyncStorage.setItem(CLIPS_KEY, JSON.stringify(clips));
    await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  } catch (e) {
    // silent
  }
}
