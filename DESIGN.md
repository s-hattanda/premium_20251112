# 習慣化トラッカーアプリケーション設計

## 技術スタック

### フロントエンド
- **React 18+** - UI構築
- **TypeScript** - 型安全性
- **Vite** - ビルドツール（Electron + React統合）
- **Electron** - デスクトップアプリケーション

### 状態管理
- **React Context API** または **Zustand** - グローバル状態管理
- **React Hooks** - ローカル状態管理

### データ永続化
- **electron-store** - ローカルファイルベースの設定/データ保存
- データ形式: JSON

### UI/スタイリング
- **Tailwind CSS** または **CSS Modules** - スタイリング
- **Lucide React** または **React Icons** - アイコン

## プロジェクト構造

```
premium_20251112/
├── electron/
│   ├── main.ts              # Electronメインプロセス
│   └── preload.ts           # プリロードスクリプト
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── HabitList.tsx
│   │   ├── HabitItem.tsx
│   │   ├── HabitForm.tsx
│   │   └── HabitTracker.tsx
│   ├── hooks/               # カスタムフック
│   │   └── useHabits.ts
│   ├── types/               # TypeScript型定義
│   │   └── habit.ts
│   ├── utils/               # ユーティリティ関数
│   │   └── storage.ts
│   ├── App.tsx              # メインアプリコンポーネント
│   └── main.tsx             # Reactエントリーポイント
├── public/                  # 静的ファイル
├── package.json
├── tsconfig.json
├── vite.config.ts
└── electron-builder.json    # Electronビルド設定
```

## データモデル

### Habit型定義
```typescript
interface Habit {
  id: string;                    // 一意のID（UUID）
  name: string;                  // 習慣名
  description?: string;          // 説明（オプション）
  color?: string;                // 表示色（オプション）
  createdAt: string;             // 作成日時（ISO 8601）
  updatedAt: string;             // 更新日時（ISO 8601）
}

interface HabitRecord {
  habitId: string;               // 習慣ID
  date: string;                  // 記録日（YYYY-MM-DD形式）
  completed: boolean;            // 完了フラグ
}
```

### ストレージ構造
```json
{
  "habits": [
    {
      "id": "uuid",
      "name": "朝の運動",
      "description": "毎朝30分のジョギング",
      "color": "#3B82F6",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "records": [
    {
      "habitId": "uuid",
      "date": "2024-01-01",
      "completed": true
    }
  ]
}
```

## アーキテクチャ

### Electronプロセス構成
1. **メインプロセス** (`electron/main.ts`)
   - ウィンドウ管理
   - electron-storeの初期化
   - IPCハンドラーの設定（必要に応じて）

2. **レンダラープロセス** (`src/`)
   - Reactアプリケーション
   - UIロジック
   - ローカルストレージへのアクセス（electron-store経由）

### 状態管理フロー
```
React Component
    ↓
Custom Hook (useHabits)
    ↓
Storage Utility (storage.ts)
    ↓
electron-store
    ↓
ローカルファイル（JSON）
```

## 主要機能設計

### 1. 習慣の追加
- フォームで習慣名、説明、色を入力
- バリデーション（習慣名は必須）
- 作成日時を自動設定
- ストレージに保存

### 2. 習慣の編集
- 既存の習慣情報をフォームに表示
- 名前、説明、色を変更可能
- 更新日時を自動更新
- ストレージに保存

### 3. 習慣の削除
- 確認ダイアログ表示
- 関連する記録も削除
- ストレージから削除

### 4. 習慣の表示
- リスト形式で表示
- 各習慣の基本情報を表示
- 色分け表示（オプション）

## UI/UX設計

### レイアウト
- シンプルな1カラムレイアウト
- ヘッダー: アプリタイトル
- メインエリア: 習慣リスト
- フッター: 追加ボタン

### コンポーネント構成
- **HabitTracker**: メインコンテナ
- **HabitList**: 習慣リスト表示
- **HabitItem**: 個別の習慣アイテム（表示、編集、削除ボタン）
- **HabitForm**: 習慣追加/編集フォーム（モーダルまたはインライン）

### インタラクション
- 追加ボタンクリック → フォーム表示
- 編集ボタンクリック → フォームに既存データを読み込み
- 削除ボタンクリック → 確認ダイアログ → 削除実行

## 開発環境設定

### 必要なパッケージ
- `electron`
- `electron-builder`
- `react`
- `react-dom`
- `typescript`
- `vite`
- `@vitejs/plugin-react`
- `electron-store`
- `uuid` (ID生成用)

### 開発スクリプト
- `dev`: 開発サーバー起動（Vite + Electron）
- `build`: プロダクションビルド
- `dist`: Electronアプリのパッケージング

## 今後の拡張可能性

- 習慣の進捗記録機能
- カレンダービュー
- 統計・グラフ表示
- リマインダー通知
- データエクスポート/インポート
- テーマ切り替え（ダークモード等）

