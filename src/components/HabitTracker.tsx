import { useState } from 'react';
import { Habit } from '@/types/habit';
import { useHabits } from '@/hooks/useHabits';
import { HabitList } from './HabitList';
import { HabitForm } from './HabitForm';
import { Plus } from 'lucide-react';

export const HabitTracker = () => {
  const { habits, loading, error, createHabit, editHabit, removeHabit } = useHabits();
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddClick = () => {
    setEditingHabit(null);
    setShowForm(true);
  };

  const handleEditClick = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleFormSubmit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingHabit) {
        await editHabit({
          ...editingHabit,
          ...habitData,
        });
      } else {
        await createHabit(habitData);
      }
      setShowForm(false);
      setEditingHabit(null);
    } catch (error) {
      console.error('Failed to save habit:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await removeHabit(id);
    } catch (error) {
      console.error('Failed to delete habit:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="habit-tracker">
      <header className="app-header">
        <h1>習慣化トラッカー</h1>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <HabitList
          habits={habits}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      </main>

      <footer className="app-footer">
        <button className="add-button" onClick={handleAddClick} aria-label="習慣を追加">
          <Plus size={20} />
          <span>習慣を追加</span>
        </button>
      </footer>

      {showForm && (
        <HabitForm
          habit={editingHabit}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};


