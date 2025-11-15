import { useState, useEffect, useCallback } from 'react';
import { Habit } from '@/types/habit';
import { getHabits, addHabit, updateHabit, deleteHabit } from '@/utils/storage';
import { v4 as uuidv4 } from 'uuid';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 習慣を読み込む
  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedHabits = await getHabits();
      setHabits(loadedHabits);
    } catch (err) {
      setError(err instanceof Error ? err.message : '習慣の読み込みに失敗しました');
      console.error('Failed to load habits:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初回読み込み
  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  // 習慣を追加
  const createHabit = useCallback(async (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const now = new Date().toISOString();
      const newHabit: Habit = {
        ...habitData,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
      };
      await addHabit(newHabit);
      await loadHabits(); // リストを再読み込み
      return newHabit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '習慣の追加に失敗しました';
      setError(errorMessage);
      console.error('Failed to create habit:', err);
      throw err;
    }
  }, [loadHabits]);

  // 習慣を更新
  const editHabit = useCallback(async (habit: Habit) => {
    try {
      setError(null);
      const updatedHabit: Habit = {
        ...habit,
        updatedAt: new Date().toISOString(),
      };
      await updateHabit(updatedHabit);
      await loadHabits(); // リストを再読み込み
      return updatedHabit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '習慣の更新に失敗しました';
      setError(errorMessage);
      console.error('Failed to update habit:', err);
      throw err;
    }
  }, [loadHabits]);

  // 習慣を削除
  const removeHabit = useCallback(async (id: string) => {
    try {
      setError(null);
      await deleteHabit(id);
      await loadHabits(); // リストを再読み込み
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '習慣の削除に失敗しました';
      setError(errorMessage);
      console.error('Failed to delete habit:', err);
      throw err;
    }
  }, [loadHabits]);

  return {
    habits,
    loading,
    error,
    createHabit,
    editHabit,
    removeHabit,
    reloadHabits: loadHabits,
  };
};


