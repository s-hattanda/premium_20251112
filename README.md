# 習慣化トラッカー

日頃の開発を習慣化するための習慣化トラッカーアプリケーションです。

## 技術スタック

- **React 18+** - UI構築
- **TypeScript** - 型安全性
- **Vite** - ビルドツール
- **Electron** - デスクトップアプリケーション
- **electron-store** - データ永続化

## セットアップ

### 必要な環境

- Node.js 18以上
- npm または yarn

### インストール

```bash
npm install
```

## 開発

### 開発サーバーの起動

```bash
npm run electron:dev
```

このコマンドは以下を実行します：
1. Vite開発サーバーを起動（http://localhost:5173）
2. Electronアプリを起動

### ブラウザでの開発（Electronなし）

```bash
npm run dev
```

## ビルド

### プロダクションビルド

```bash
npm run build
```

### Electronアプリのパッケージング

```bash
npm run dist
```

ビルドされたアプリは `release` ディレクトリに出力されます。

## 機能

- ✅ 習慣の追加
- ✅ 習慣の編集
- ✅ 習慣の削除
- ✅ 習慣の一覧表示
- ✅ 色分け表示

## プロジェクト構造

```
premium_20251112/
├── electron/              # Electronメインプロセス
│   ├── main.ts           # メインプロセス
│   ├── preload.ts        # プリロードスクリプト
│   └── vite.config.ts    # Electron用ビルド設定
├── src/
│   ├── components/       # Reactコンポーネント
│   ├── hooks/            # カスタムフック
│   ├── types/            # TypeScript型定義
│   ├── utils/            # ユーティリティ関数
│   ├── App.tsx           # メインアプリコンポーネント
│   ├── main.tsx          # Reactエントリーポイント
│   └── index.css         # スタイル
├── public/               # 静的ファイル
└── package.json
```

## ライセンス

MIT

