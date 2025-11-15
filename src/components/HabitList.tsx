import { Habit } from '@/types/habit';
import { HabitItem } from './HabitItem';

interface HabitListProps {
  habits: Habit[];
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export const HabitList = ({ habits, onEdit, onDelete }: HabitListProps) => {
  if (habits.length === 0) {
    return (
      <div className="empty-state">
        <p>まだ習慣が登録されていません。</p>
        <p className="empty-state-hint">「+ 習慣を追加」ボタンから新しい習慣を追加してください。</p>
      </div>
    );
  }

  return (
    <div className="habit-list">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};


