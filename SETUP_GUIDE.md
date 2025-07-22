# Supabase セットアップガイド

## 1. Supabaseプロジェクト作成

1. https://supabase.com にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでサインイン
4. 「New project」をクリック
5. 以下の情報を入力：
   - **Name**: `household-account-book`
   - **Database Password**: 強力なパスワードを設定
   - **Region**: `Northeast Asia (Tokyo)` を選択
6. 「Create new project」をクリック

## 2. データベーステーブル作成

プロジェクト作成完了後：

1. 左メニューから「SQL Editor」をクリック
2. 新しいクエリを作成
3. `supabase-setup.sql` ファイルの内容をコピー＆ペースト
4. 「RUN」をクリックしてSQL実行

## 3. 環境変数の設定

1. 左メニューから「Settings」→「API」をクリック
2. 以下の値をコピー：
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon public key**: `eyJ...` (長いキー文字列)
3. `.env.local` ファイルを編集：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
```

## 4. 認証設定

1. 左メニューから「Authentication」→「Settings」をクリック
2. 「Site URL」に以下を設定：
   - Development: `http://localhost:3000`
   - Production: `https://your-vercel-domain.vercel.app`

## 5. 動作確認

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセスして動作確認

## トラブルシューティング

- **接続エラー**: 環境変数のURL/KEYが正しく設定されているか確認
- **認証エラー**: Site URLが正しく設定されているか確認
- **データベースエラー**: SQLが正常に実行されたか確認