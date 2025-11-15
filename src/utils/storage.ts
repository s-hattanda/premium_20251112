import Store from 'electron-store';
import { Habit, HabitRecord, StorageData } from '@/types/habit';

// electron-storeのインスタンスを作成
// レンダラープロセスで使用するため、IPC経由でアクセスする必要があります
// ここでは、レンダラープロセスで直接使用できるようにするため、
// グローバル変数として公開する方法を想定しています

// 型定義を拡張
declare global {
  interface Window {
    electronAPI?: {
      getStore: () => StorageData;
      setStore: (data: StorageData) => void;
      getHabits: () => Habit[];
      addHabit: (habit: Habit) => void;
      updateHabit: (habit: Habit) => void;
      deleteHabit: (id: string) => void;
      getRecords: () => HabitRecord[];
      addRecord: (record: HabitRecord) => void;
      deleteRecordsByHabitId: (habitId: string) => void;
    };
  }
}

// レンダラープロセス用のストレージユーティリティ
// 実際の実装はelectron-storeを使用しますが、
// レンダラープロセスからはIPC経由でアクセスする必要があります
// ここでは、ローカルストレージのフォールバック実装を提供します

const STORAGE_KEY = 'habit-tracker-data';

const defaultData: StorageData = {
  habits: [],
  records: [],
};

// ローカルストレージからデータを取得
export const getStorageData = async (): Promise<StorageData> => {
  if (window.electronAPI) {
    // Electron環境ではelectron-storeを使用
    return await window.electronAPI.getStore();
  } else {
    // フォールバック: ローカルストレージを使用
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultData;
  }
};

// ローカルストレージにデータを保存
export const setStorageData = async (data: StorageData): Promise<void> => {
  if (window.electronAPI) {
    // Electron環境ではelectron-storeを使用
    await window.electronAPI.setStore(data);
  } else {
    // フォールバック: ローカルストレージを使用
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

// 習慣を取得
export const getHabits = async (): Promise<Habit[]> => {
  if (window.electronAPI) {
    return await window.electronAPI.getHabits();
  }
  const data = await getStorageData();
  return data.habits;
};

// 習慣を追加
export const addHabit = async (habit: Habit): Promise<void> => {
  if (window.electronAPI) {
    await window.electronAPI.addHabit(habit);
  } else {
    const data = await getStorageData();
    data.habits.push(habit);
    await setStorageData(data);
  }
};

// 習慣を更新
export const updateHabit = async (habit: Habit): Promise<void> => {
  if (window.electronAPI) {
    await window.electronAPI.updateHabit(habit);
  } else {
    const data = await getStorageData();
    const index = data.habits.findIndex((h) => h.id === habit.id);
    if (index !== -1) {
      data.habits[index] = habit;
      await setStorageData(data);
    }
  }
};

// 習慣を削除
export const deleteHabit = async (id: string): Promise<void> => {
  if (window.electronAPI) {
    await window.electronAPI.deleteHabit(id);
  } else {
    const data = await getStorageData();
    data.habits = data.habits.filter((h) => h.id !== id);
    // 関連する記録も削除
    data.records = data.records.filter((r) => r.habitId !== id);
    await setStorageData(data);
  }
};

// 記録を取得
export const getRecords = async (): Promise<HabitRecord[]> => {
  if (window.electronAPI) {
    return await window.electronAPI.getRecords();
  }
  const data = await getStorageData();
  return data.records;
};

// 記録を追加
export const addRecord = async (record: HabitRecord): Promise<void> => {
  if (window.electronAPI) {
    await window.electronAPI.addRecord(record);
  } else {
    const data = await getStorageData();
    data.records.push(record);
    await setStorageData(data);
  }
};

// 習慣IDに関連する記録を削除
export const deleteRecordsByHabitId = async (habitId: string): Promise<void> => {
  if (window.electronAPI) {
    await window.electronAPI.deleteRecordsByHabitId(habitId);
  } else {
    const data = await getStorageData();
    data.records = data.records.filter((r) => r.habitId !== habitId);
    await setStorageData(data);
  }
};

