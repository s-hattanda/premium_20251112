import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import Store from 'electron-store';
import { Habit, HabitRecord, StorageData } from '../src/types/habit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// electron-storeの初期化
const store = new Store<StorageData>({
  defaults: {
    habits: [],
    records: [],
  },
});

// 開発環境かどうかを判定
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // 開発環境ではViteの開発サーバー、本番環境ではビルド済みファイルを読み込む
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// アプリケーションの準備が完了したらウィンドウを作成
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // macOSでは、ドックアイコンがクリックされたときにウィンドウが開いていない場合、
    // 新しいウィンドウを作成する
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// すべてのウィンドウが閉じられたときにアプリを終了（macOSを除く）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPCハンドラーの設定
ipcMain.handle('store:get', () => {
  return store.store;
});

ipcMain.handle('store:set', (_event, data: StorageData) => {
  store.store = data;
  return store.store;
});

ipcMain.handle('habits:get', () => {
  return store.get('habits', []);
});

ipcMain.handle('habits:add', (_event, habit: Habit) => {
  const habits = store.get('habits', []);
  habits.push(habit);
  store.set('habits', habits);
  return habits;
});

ipcMain.handle('habits:update', (_event, habit: Habit) => {
  const habits = store.get('habits', []);
  const index = habits.findIndex((h) => h.id === habit.id);
  if (index !== -1) {
    habits[index] = habit;
    store.set('habits', habits);
  }
  return habits;
});

ipcMain.handle('habits:delete', (_event, id: string) => {
  const habits = store.get('habits', []);
  const filteredHabits = habits.filter((h) => h.id !== id);
  store.set('habits', filteredHabits);
  
  // 関連する記録も削除
  const records = store.get('records', []);
  const filteredRecords = records.filter((r) => r.habitId !== id);
  store.set('records', filteredRecords);
  
  return filteredHabits;
});

ipcMain.handle('records:get', () => {
  return store.get('records', []);
});

ipcMain.handle('records:add', (_event, record: HabitRecord) => {
  const records = store.get('records', []);
  records.push(record);
  store.set('records', records);
  return records;
});

ipcMain.handle('records:deleteByHabitId', (_event, habitId: string) => {
  const records = store.get('records', []);
  const filteredRecords = records.filter((r) => r.habitId !== habitId);
  store.set('records', filteredRecords);
  return filteredRecords;
});

