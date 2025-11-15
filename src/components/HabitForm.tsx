import { useState, useEffect } from 'react';
import { Habit } from '@/types/habit';
import { X } from 'lucide-react';

interface HabitFormProps {
  habit?: Habit | null;
  onSubmit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
}

const defaultColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

export const HabitForm = ({ habit, onSubmit, onCancel }: HabitFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(defaultColors[0]);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description || '');
      setColor(habit.color || defaultColors[0]);
    } else {
      setName('');
      setDescription('');
      setColor(defaultColors[0]);
    }
  }, [habit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        color: color || undefined,
      });
      // フォームをリセット
      setName('');
      setDescription('');
      setColor(defaultColors[0]);
    } catch (error) {
      console.error('Failed to submit habit:', error);
    }
  };

  return (
    <div className="habit-form-overlay" onClick={onCancel}>
      <div className="habit-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="habit-form-header">
          <h2>{habit ? '習慣を編集' : '新しい習慣を追加'}</h2>
          <button className="close-button" onClick={onCancel} aria-label="閉じる">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="habit-form">
          <div className="form-group">
            <label htmlFor="habit-name">
              習慣名 <span className="required">*</span>
            </label>
            <input
              id="habit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 朝の運動"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="habit-description">説明（オプション）</label>
            <textarea
              id="habit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例: 毎朝30分のジョギング"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>色</label>
            <div className="color-picker">
              {defaultColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-option ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`色を選択: ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              キャンセル
            </button>
            <button type="submit" className="submit-button" disabled={!name.trim()}>
              {habit ? '更新' : '追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


