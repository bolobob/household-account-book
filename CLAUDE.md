# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

家計簿アプリケーション（シンプル家計簿）- 日々の支出を簡単に管理するReact/TypeScriptアプリケーション

## アーキテクチャ

### コンポーネント構造
- **App.tsx**: メインアプリケーションコンポーネント。全体の状態管理とタブナビゲーション
- **components/**: カスタムコンポーネント
  - BudgetDisplay.tsx: 予算表示と進捗表示
  - ExpenseForm.tsx: 支出入力フォーム
  - ExpenseHistory.tsx: 支出履歴表示
  - MonthlyReport.tsx: 月次レポート
  - MonthNavigation.tsx: 月切り替えナビゲーション
  - BudgetSettingForm.tsx: 予算設定フォーム
- **components/ui/**: shadcn/uiベースのUIコンポーネント
- **components/figma/**: Figmaから生成されたコンポーネント

### 技術スタック
- React + TypeScript
- Tailwind CSS
- shadcn/ui コンポーネントライブラリ
- Lucide React アイコン

### データ構造
```typescript
interface Expense {
  id: string;
  amount: number;
  date: string;
}

interface Budget {
  [key: string]: number; // "2025-1": 50000 のような形式
}
```

## 開発ガイドライン

### スタイリング
- フォントサイズ基準: 14px
- メインテーマカラー: #4CAF50
- Tailwind CSSクラスとshadcn/uiコンポーネントを使用
- レスポンシブデザインはflexboxとgridを優先

### コンポーネント設計
- 関数コンポーネントとReact Hooksを使用
- propsの型定義は必須
- 状態はApp.tsxで一元管理（リフトアップパターン）

### 日本語対応
- UIテキストは日本語
- 日付フォーマット: "YYYY-MM-DD"
- 通貨表示: 円（¥）記号付き

## 重要な注意事項

このプロジェクトには設定ファイル（package.json、tsconfig.json等）が見つからないため、開発環境の構築コマンドは不明です。

新しい機能を追加する際は：
1. 既存のコンポーネントパターンに従う
2. TypeScript型定義を適切に行う
3. shadcn/uiコンポーネントを活用する
4. Tailwind CSSでスタイリングする