import { Habit } from '@/types/habit';
import { Edit2, Trash2 } from 'lucide-react';

interface HabitItemProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export const HabitItem = ({ habit, onEdit, onDelete }: HabitItemProps) => {
  const handleDelete = () => {
    if (window.confirm(`「${habit.name}」を削除してもよろしいですか？`)) {
      onDelete(habit.id);
    }
  };

  return (
    <div className="habit-item" style={{ borderLeftColor: habit.color || '#3B82F6' }}>
      <div className="habit-item-content">
        <div className="habit-item-header">
          <h3 className="habit-name">{habit.name}</h3>
          <div className="habit-actions">
            <button
              className="action-button edit-button"
              onClick={() => onEdit(habit)}
              aria-label="編集"
            >
              <Edit2 size={16} />
            </button>
            <button
              className="action-button delete-button"
              onClick={handleDelete}
              aria-label="削除"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        {habit.description && (
          <p className="habit-description">{habit.description}</p>
        )}
      </div>
    </div>
  );
};


