// Browser IndexedDB service for true offline data persistence
const DB_NAME = 'kisan_saathi_offline_db';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Store for pending offline disease photos waiting for connection
      if (!db.objectStoreNames.contains('pendingDiseaseUploads')) {
        const uploadStore = db.createObjectStore('pendingDiseaseUploads', { keyPath: 'id' });
        uploadStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Store for saved crop recommendation history
      if (!db.objectStoreNames.contains('cropRecommendations')) {
        const cropStore = db.createObjectStore('cropRecommendations', { keyPath: 'id' });
        cropStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // Store for completed plant diagnoses
      if (!db.objectStoreNames.contains('diagnosesHistory')) {
        const diagStore = db.createObjectStore('diagnosesHistory', { keyPath: 'id' });
        diagStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const offlineStorage = {
  // Pending offline image uploads
  async savePendingUpload(upload) {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('pendingDiseaseUploads', 'readwrite');
        const store = tx.objectStore('pendingDiseaseUploads');
        const record = {
          id: upload.id || `up_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          crop: upload.crop,
          imageData: upload.imageData,
          imageName: upload.imageName,
          status: 'pending_sync',
          createdAt: new Date().toISOString()
        };
        const req = store.put(record);
        req.onsuccess = () => resolve(record);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('IndexedDB error, falling back to localStorage', e);
      const fallbackList = JSON.parse(localStorage.getItem('kisan_pending_uploads') || '[]');
      fallbackList.push(upload);
      localStorage.setItem('kisan_pending_uploads', JSON.stringify(fallbackList));
      return upload;
    }
  },

  async getPendingUploads() {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('pendingDiseaseUploads', 'readonly');
        const store = tx.objectStore('pendingDiseaseUploads');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      return JSON.parse(localStorage.getItem('kisan_pending_uploads') || '[]');
    }
  },

  async deletePendingUpload(id) {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('pendingDiseaseUploads', 'readwrite');
        const store = tx.objectStore('pendingDiseaseUploads');
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      const fallbackList = JSON.parse(localStorage.getItem('kisan_pending_uploads') || '[]');
      const filtered = fallbackList.filter(item => item.id !== id);
      localStorage.setItem('kisan_pending_uploads', JSON.stringify(filtered));
      return true;
    }
  },

  // Crop recommendation persistence
  async saveRecommendation(rec) {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('cropRecommendations', 'readwrite');
        const store = tx.objectStore('cropRecommendations');
        const record = {
          id: rec.id || `rec_${Date.now()}`,
          timestamp: new Date().toISOString(),
          ...rec
        };
        const req = store.put(record);
        req.onsuccess = () => resolve(record);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      const fallback = JSON.parse(localStorage.getItem('kisan_crop_recs') || '[]');
      fallback.unshift(rec);
      localStorage.setItem('kisan_crop_recs', JSON.stringify(fallback.slice(0, 20)));
      return rec;
    }
  },

  async getRecommendations() {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('cropRecommendations', 'readonly');
        const store = tx.objectStore('cropRecommendations');
        const req = store.getAll();
        req.onsuccess = () => {
          const list = req.result || [];
          list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          resolve(list);
        };
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      return JSON.parse(localStorage.getItem('kisan_crop_recs') || '[]');
    }
  },

  // Diagnosis history persistence
  async saveDiagnosis(diag) {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('diagnosesHistory', 'readwrite');
        const store = tx.objectStore('diagnosesHistory');
        const record = {
          id: diag.id || `diag_${Date.now()}`,
          timestamp: new Date().toISOString(),
          ...diag
        };
        const req = store.put(record);
        req.onsuccess = () => resolve(record);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      const fallback = JSON.parse(localStorage.getItem('kisan_diagnoses') || '[]');
      fallback.unshift(diag);
      localStorage.setItem('kisan_diagnoses', JSON.stringify(fallback.slice(0, 20)));
      return diag;
    }
  },

  async getDiagnoses() {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('diagnosesHistory', 'readonly');
        const store = tx.objectStore('diagnosesHistory');
        const req = store.getAll();
        req.onsuccess = () => {
          const list = req.result || [];
          list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          resolve(list);
        };
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      return JSON.parse(localStorage.getItem('kisan_diagnoses') || '[]');
    }
  }
};
