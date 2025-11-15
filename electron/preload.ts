import { contextBridge, ipcRenderer } from 'electron';

// 型定義を直接定義（プリロードスクリプトでは型のみ使用）
interface Habit {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

interface HabitRecord {
  habitId: string;
  date: string;
  completed: boolean;
}

interface StorageData {
  habits: Habit[];
  records: HabitRecord[];
}

// セキュアなコンテキストブリッジを使用してAPIを公開
contextBridge.exposeInMainWorld('electronAPI', {
  getStore: (): Promise<StorageData> => ipcRenderer.invoke('store:get'),
  setStore: (data: StorageData): Promise<StorageData> => ipcRenderer.invoke('store:set', data),
  getHabits: (): Promise<Habit[]> => ipcRenderer.invoke('habits:get'),
  addHabit: (habit: Habit): Promise<Habit[]> => ipcRenderer.invoke('habits:add', habit),
  updateHabit: (habit: Habit): Promise<Habit[]> => ipcRenderer.invoke('habits:update', habit),
  deleteHabit: (id: string): Promise<Habit[]> => ipcRenderer.invoke('habits:delete', id),
  getRecords: (): Promise<HabitRecord[]> => ipcRenderer.invoke('records:get'),
  addRecord: (record: HabitRecord): Promise<HabitRecord[]> => ipcRenderer.invoke('records:add', record),
  deleteRecordsByHabitId: (habitId: string): Promise<HabitRecord[]> => ipcRenderer.invoke('records:deleteByHabitId', habitId),
});

