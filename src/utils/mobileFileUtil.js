import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/**
 * Saves and shares a base64 encoded file natively, with a web fallback.
 * @param {string} base64Data - The base64 string of the file (can include data URL prefix).
 * @param {string} filename - The name of the file (e.g., 'QuestionPaper.pdf').
 * @param {string} mimeType - The MIME type (e.g., 'application/pdf').
 */
export const saveAndShareFile = async (base64Data, filename, mimeType = 'application/pdf') => {
  // 1. Fallback for Web Browser testing
  if (!Capacitor.isNativePlatform()) {
    const a = document.createElement('a');
    a.href = base64Data.startsWith('data:') ? base64Data : `data:${mimeType};base64,${base64Data}`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  // 2. Native Android Implementation
  try {
    // Strip the 'data:application/pdf;base64,' prefix if it exists
    const base64String = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;

    // Write the file to the app's cache directory (avoids needing strict storage permissions)
    const savedFile = await Filesystem.writeFile({
      path: filename,
      data: base64String,
      directory: Directory.Cache,
    });

    // Trigger the native Android Share dialog
    await Share.share({
      title: filename,
      text: 'Here is the generated question paper.',
      url: savedFile.uri,
      dialogTitle: 'Save or Share PDF',
    });
  } catch (error) {
    console.error('Error saving or sharing file natively:', error);
    alert('Failed to save or share the file.');
  }
};
