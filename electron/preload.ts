import { contextBridge, ipcRenderer } from 'electron';
import { Habit, HabitRecord, StorageData } from '../src/types/habit';

// セキュアなコンテキストブリッジを使用してAPIを公開
contextBridge.exposeInMainWorld('electronAPI', {
  getStore: (): StorageData => ipcRenderer.invoke('store:get'),
  setStore: (data: StorageData): Promise<StorageData> => ipcRenderer.invoke('store:set', data),
  getHabits: (): Promise<Habit[]> => ipcRenderer.invoke('habits:get'),
  addHabit: (habit: Habit): Promise<Habit[]> => ipcRenderer.invoke('habits:add', habit),
  updateHabit: (habit: Habit): Promise<Habit[]> => ipcRenderer.invoke('habits:update', habit),
  deleteHabit: (id: string): Promise<Habit[]> => ipcRenderer.invoke('habits:delete', id),
  getRecords: (): Promise<HabitRecord[]> => ipcRenderer.invoke('records:get'),
  addRecord: (record: HabitRecord): Promise<HabitRecord[]> => ipcRenderer.invoke('records:add', record),
  deleteRecordsByHabitId: (habitId: string): Promise<HabitRecord[]> => ipcRenderer.invoke('records:deleteByHabitId', habitId),
});

