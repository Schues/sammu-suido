# 山武郡市広域水道企業団 公式サイト

## 概要

山武郡市広域水道企業団の公式ウェブサイトです。

## 技術スタック

- HTML5
- SCSS (Sass)
- JavaScript (Vanilla)

## プロジェクト構造

```
sammu-suido/
├── scss/
│   ├── common.scss      # 共通スタイル（ヘッダー、フッター、変数、mixin）
│   ├── front-page.scss  # フロントページ専用スタイル
│   └── styles.scss      # WordPress用スタイル
├── css/
│   ├── common.css       # コンパイル済み共通スタイル
│   ├── front-page.css   # コンパイル済みフロントページスタイル
│   └── styles.css       # WordPress用コンパイル済みスタイル
├── images/              # 画像ファイル
├── index.html           # メインHTMLファイル
└── README.md            # このファイル
```

## 開発環境

### 必要な環境

- Node.js (推奨: v18以上)
- VS Code (推奨)
- Sass Compiler拡張機能

### VS Code設定

`.vscode/settings.json`にSassコンパイル設定が含まれています。

## 開発方法

1. リポジトリをクローン
2. VS Codeでプロジェクトを開く
3. SCSSファイルを編集すると自動的にCSSファイルにコンパイルされます

## SCSS変数とmixin

### ブレークポイント

```scss
$breakpoint-xs: 480px;
$breakpoint-sm: 768px;
$breakpoint-md: 1024px;
$breakpoint-lg: 1280px;
$breakpoint-xl: 1400px;
```

### メディアクエリmixin

```scss
@include media-sm { ... }  // max-width: 767px
@include media-md { ... }  // max-width: 1023px
```

### 主要な変数

- `$container-max-width`: 1400px
- `$spacing-xs` ~ `$spacing-xxl`: スペーシング
- `$font-size-xs` ~ `$font-size-xxxl`: フォントサイズ
- `$text-color`, `$text-color-light`: テキストカラー
- `$accent-color`, `$emergency-color`: アクセントカラー

詳細は`scss/common.scss`を参照してください。

## レイアウト

### PC表示

- コンテンツ幅: 1400px
- 左カラム（aside）: 25% width, sticky
- 右カラム: 75% width
  - 緊急情報セクション
  - お知らせセクション

### モバイル表示

- レスポンシブ対応（768px以下）
- 左カラムは最下部に表示

## ToDoリスト

### バグ修正

- [ ] メガメニュー表示された時後ろのコンテンツが動く問題

### 機能追加

- [ ] 山水ちゃんの設置（左カラム）

---

## ライセンス

このプロジェクトは山武郡市広域水道企業団の所有物です。

