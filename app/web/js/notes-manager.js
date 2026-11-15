/**
 * Quản Lý Sổ Tay Tu Học & Đánh Dấu Kinh Điển (Notes & Bookmarks Manager)
 * Lưu trữ bền vững tại LocalStorage trình duyệt
 */
class DhammaNotesManager {
  constructor() {
    this.STORAGE_KEY_NOTES = 'dhamma_library_notes_v1';
    this.STORAGE_KEY_BOOKMARKS = 'dhamma_library_bookmarks_v1';
    this.STORAGE_KEY_PROGRESS = 'dhamma_library_progress_v1';
  }

  getNotes() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY_NOTES)) || [];
    } catch (e) {
      return [];
    }
  }

  saveNote(title, content, tags = [], source = '') {
    const notes = this.getNotes();
    const newNote = {
      id: 'note_' + Date.now(),
      title: title || 'Ghi chép quán chiếu',
      content: content,
      tags: tags,
      source: source,
      createdAt: new Date().toISOString()
    };
    notes.unshift(newNote);
    localStorage.setItem(this.STORAGE_KEY_NOTES, JSON.stringify(notes));
    return newNote;
  }

  deleteNote(id) {
    let notes = this.getNotes();
    notes = notes.filter(n => n.id !== id);
    localStorage.setItem(this.STORAGE_KEY_NOTES, JSON.stringify(notes));
    return notes;
  }

  getBookmarks() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY_BOOKMARKS)) || [];
    } catch (e) {
      return [];
    }
  }

  toggleBookmark(item) {
    const bookmarks = this.getBookmarks();
    const existingIdx = bookmarks.findIndex(b => b.id === item.id);
    if (existingIdx >= 0) {
      bookmarks.splice(existingIdx, 1);
      localStorage.setItem(this.STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
      return false; // Removed
    } else {
      bookmarks.unshift({
        id: item.id,
        title: item.title,
        type: item.type || 'kinh',
        summary: item.summary || '',
        savedAt: new Date().toISOString()
      });
      localStorage.setItem(this.STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
      return true; // Added
    }
  }

  isBookmarked(id) {
    const bookmarks = this.getBookmarks();
    return bookmarks.some(b => b.id === id);
  }

  exportBackup() {
    const data = {
      notes: this.getNotes(),
      bookmarks: this.getBookmarks(),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dhamma_tu_hoc_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.notes)) {
        localStorage.setItem(this.STORAGE_KEY_NOTES, JSON.stringify(data.notes));
      }
      if (Array.isArray(data.bookmarks)) {
        localStorage.setItem(this.STORAGE_KEY_BOOKMARKS, JSON.stringify(data.bookmarks));
      }
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  }
}

window.dhammaNotes = new DhammaNotesManager();
