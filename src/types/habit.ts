export interface Habit {
  id: string;                    // 一意のID（UUID）
  name: string;                  // 習慣名
  description?: string;          // 説明（オプション）
  color?: string;                // 表示色（オプション）
  createdAt: string;             // 作成日時（ISO 8601）
  updatedAt: string;             // 更新日時（ISO 8601）
}

export interface HabitRecord {
  habitId: string;               // 習慣ID
  date: string;                  // 記録日（YYYY-MM-DD形式）
  completed: boolean;            // 完了フラグ
}

export interface StorageData {
  habits: Habit[];
  records: HabitRecord[];
}


