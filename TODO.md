# STORY HP — 残作業・改善タスクリスト

> 作成日: 2026-03-23
> 現状: 静的マルチページサイト（HTML/CSS/JS + localStorage）
> ホスティング: Netlify（story-kizoro.netlify.app 想定）

---

## 凡例

| マーク | 意味 |
|--------|------|
| 🔴 **必須** | リリース前に対応すべき重大な問題 |
| 🟡 **推奨** | UX・SEO・運用に直接影響する改善 |
| 🟢 **オプション** | あれば良い追加機能・将来対応 |
| ✅ **完了** | 実装済み |

---

## 🔴 必須対応（リリース前に対応すること）

### 1. フォームが実際にデータを送信していない ← 最重要

**現状の問題：**
`reserve.html`・`banquet.html` の予約フォームは送信ボタンを押しても
「✅ 送信ありがとうございます」と表示されるだけで、
**お店側には何も届いていない。** 実運用不可の状態。

**推奨対応：Netlify Forms（無料・設定5分）**

```html
<!-- reserve.html の <form> タグを以下に変更するだけ -->
<form name="takeout-order" method="POST" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="takeout-order">
  <!-- 既存フィールドはそのまま -->
</form>
```

- Netlify管理画面 → Forms → 送信内容をメール通知またはSlack通知に設定
- 対象フォーム: `reserve.html`（テイクアウト・席予約）、`banquet.html`（宴会予約）
- `loyalty.html` のレビュー投稿はlocalStorageのみでOK（お客様向け表示のため）

**代替案：** [FormSubmit.co](https://formsubmit.co/)（バックエンド不要・メール転送）

---

### 2. OGP画像（og:image）が未設定

**現状：** 全ページで `og:image` タグがない。
LINEやXでシェアされた際に画像が表示されず、CTRが大幅に下がる。

**対応：** 各ページのhead内に追加

```html
<!-- 全ページ共通（1200×630px 推奨） -->
<meta property="og:image" content="https://story-kizoro.netlify.app/assets/ogp.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<!-- URLは各ページに合わせて設定 -->
<meta property="og:url" content="https://story-kizoro.netlify.app/">
```

**必要作業：**
1. OGP画像（1200×630px）を作成して `assets/ogp.jpg` に配置
2. 全6ページ＋ニュース記事テンプレートに追加

---

### 3. ファビコン（タブアイコン）が未設定

**対応：**
1. ストケロ君または店ロゴの画像を `assets/favicon.ico`（32×32px）に配置
2. 全HTMLの `<head>` に追加：

```html
<link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
```

---

### 4. マスコット画像（ストケロ君）が空

**現状：** `js/data.js` の `STOKERO_IMG = ''` により、ヒーローエリアに
空の `<img>` タグが残っている（altテキストは表示されるが見た目が崩れる）。

**対応 A（画像がある場合）：**
`assets/stokero.webp` に画像を配置し `STOKERO_IMG` に相対パスを設定。

**対応 B（画像がない場合）：**
`index.html` のヒーローセクションから `.hero-stokero` ブロックを削除し、
`css/style.css` の `.hero-inner` を `grid-template-columns: 1fr;` に変更。

---

## 🟡 推奨対応（早めに対応すべき改善）

### 5. ギャラリー（about.html）に実際の料理写真がない

**現状：** 絵文字（🧄🍡🧋）が並んでいるだけ。
お客様が「写真で見て来店を決める」フローが機能していない。

**対応：**
1. 料理写真を撮影して `assets/gallery/` フォルダに配置
2. `js/data.js` の `GALLERY_EMOJIS` を画像パスの配列に置き換え
3. `js/gallery.js` の `renderGallery()` を `<img>` タグに変更

```javascript
// 変更後のイメージ
const GALLERY_IMAGES = [
  { src: 'assets/gallery/karaage-teishoku.jpg', alt: 'ガリバタからあげ定食' },
  { src: 'assets/gallery/story-yaki.jpg',        alt: 'モダンストーリー焼き' },
  // ...
];
```

---

### 6. sitemap.xml・robots.txt が未作成

SEO基本対応。Googleへのインデックス促進に必要。

**`sitemap.xml`（ルートに配置）：**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://story-kizoro.netlify.app/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://story-kizoro.netlify.app/menu.html</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://story-kizoro.netlify.app/reserve.html</loc><priority>0.8</priority></url>
  <url><loc>https://story-kizoro.netlify.app/banquet.html</loc><priority>0.8</priority></url>
  <url><loc>https://story-kizoro.netlify.app/about.html</loc><priority>0.7</priority></url>
  <url><loc>https://story-kizoro.netlify.app/loyalty.html</loc><priority>0.6</priority></url>
  <url><loc>https://story-kizoro.netlify.app/news/index.html</loc><priority>0.6</priority></url>
  <!-- ニュース記事を追加するたびにここにも追記 -->
</urlset>
```

**`robots.txt`（ルートに配置）：**
```
User-agent: *
Allow: /
Disallow: /tools/

Sitemap: https://story-kizoro.netlify.app/sitemap.xml
```

---

### 7. Google Search Console への登録

1. [Google Search Console](https://search.google.com/search-console/) にサイトを登録
2. `sitemap.xml` を送信
3. インデックス状況・検索クエリを定期確認

---

### 8. 混雑グリッドのデータが固定値

**現状：** `index.html` の混雑グリッドは見た目だけで、実際の混雑状況と連動していない。

**対応 A（シンプル）：** 曜日・時間帯の統計的な混雑パターンを `data.js` に記載し、
現在時刻と照合して自動でハイライト表示する。

**対応 B（削除）：** 実態と乖離したまま表示し続けるとユーザーの信頼を損なうため、
データが揃うまでセクションごと非表示にする。

---

### 9. ニュース記事を追加するたびの作業フローの整備

**現状：** `tools/news-creator.html` でHTML生成後、手動で `js/data.js` の
`NEWS_LIST` を編集する必要がある。

**推奨：** `NEWS_LIST` の更新忘れを防ぐため、`tools/news-creator.html` に
「次のステップ」チェックリストを追加し、手順を明示する。

---

### 10. Netlify独自ドメインの設定

**現状：** `story-kizoro.netlify.app`（Netlifyデフォルトドメイン）
独自ドメイン（例: `story-kizoro.jp`）を取得することでSEO・信頼性向上。

**対応：**
1. ドメイン取得（お名前.com / ムームードメイン 等）
2. Netlify管理画面 → Domain settings → Add custom domain
3. DNSを設定（Netlify側で自動SSL対応）

---

## 🟢 オプション対応（将来フェーズ）

### Phase 2：コンテンツ管理の効率化

#### 11. Netlify CMS の導入（ニュース投稿を管理画面化）

Git + Netlify CMS を使えば、HTMLを触らずにブラウザ上の管理画面から
ニュース記事を投稿・編集できる。

```
管理画面URL: https://story-kizoro.netlify.app/admin/
→ Googleアカウントでログイン → 記事作成 → 自動ビルド・公開
```

**追加ファイル：**
- `admin/index.html`（管理UI）
- `admin/config.yml`（コレクション定義）

**コスト：** 無料（Netlifyの機能として含まれる）

---

#### 12. ニュース個別記事へのOGP画像生成

各記事のシェア時に記事タイトルを含むOGP画像を自動生成する。

**選択肢：**
- [Satori](https://github.com/vercel/satori)（Netlify Functions使用）
- [Cloudinary](https://cloudinary.com/)（テンプレートベースの画像生成、無料枠あり）

---

#### 13. Google Analytics 4 の導入

アクセス数・流入元・人気ページを把握してマーケティングに活用。

```html
<!-- 全ページの <head> に追加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**注意：** 導入時はプライバシーポリシーページとCookieバナーも必要。

---

### Phase 3：ユーザー機能のデジタル化

#### 14. LINE Login + スタンプカードのサーバー管理

**現状の問題点：**
- スタンプはlocalStorage → 機種変更・キャッシュクリアで消える
- クーポンの「1回限り」はlocalStorageで管理 → 悪意ある操作で無効化可能
- スタンプはお客様が自由に押せる（スタッフが管理できない）

**理想の構成：**
```
[お客様のLINEアプリ]
      ↓ LINE Login
[STORY会員ページ]
      ↓ API
[バックエンド（Firebase / Supabase）]
      ↓
[管理者ダッシュボード] ← スタッフがスタンプを付与
```

**必要工数：** 3〜6週間 / 月額コスト: 無料〜3,000円程度
**優先度：** 集客が安定してから検討

---

#### 15. 予約管理ダッシュボード（管理者専用）

**機能：**
- 予約一覧・ステータス管理（確認済み/未確認/キャンセル）
- 日付別カレンダー表示
- お客様へのSMS/LINE返信

**構成案：** Firebase + シンプルなSPAダッシュボード
または Googleスプレッドシート + Netlify Forms の組み合わせ（低コスト）

---

#### 16. Uber Eats 出店後の連携

出店後に対応：
- `index.html`・`menu.html` の「近日出店」バナーを実際のリンクに変更
- Uber Eats 対応商品フラグを `MENU_ITEMS` に追加（`uber: true`）
- メニューページにUber Eatsバッジ表示

---

#### 17. PWA（Progressive Web App）対応

ホーム画面追加・オフラインキャッシュに対応。
「アプリ感」が出て再来店を促しやすくなる。

**必要ファイル：**
- `manifest.json`（アプリ名・アイコン・テーマカラー）
- `sw.js`（Service Worker、静的アセットをキャッシュ）

---

#### 18. 多言語対応（日英）

川口市は外国人居住者が多いため、英語対応で新規客層を獲得できる可能性がある。

**対応方針：**
- `lang="en"` の英語版ページを別ディレクトリ（`/en/`）に作成
- ナビゲーションに言語切替ボタンを追加
- `data.js` のメニューデータに英語名を追加

---

### パフォーマンス最適化（オプション）

#### 19. 画像の最適化

- WebP形式での提供
- `loading="lazy"` を全画像に追加
- 画像サイズの適切な指定（`width`・`height` 属性）

#### 20. CSS・JS の最小化（Minify）

本番環境では minify してファイルサイズを削減。
Netlify のビルドプラグインで自動化可能。

#### 21. Print CSS の追加

メニューを印刷したいお客様・スタッフ向け。

```css
@media print {
  #navbar, #site-footer, .btn-primary, #cart-fab { display: none; }
  .menu-card { break-inside: avoid; }
}
```

---

## 技術的負債（認識しておくべき既知の問題）

| 問題 | 影響 | 対応優先度 |
|------|------|-----------|
| フォームが未送信（#1参照） | 予約が届かない | 🔴 即対応 |
| レビューがlocalStorageのみ | 端末間で共有されない・クリア可能 | 🟡 Phase 3で解消 |
| スタンプ・クーポンが改ざん可能 | ローカルデータの書き換えで悪用可能 | 🟡 Phase 3で解消 |
| ニュース一覧URLがlocalStorageに非依存 | 記事を追加するたびにdata.jsを手動更新 | 🟡 Netlify CMS導入で解消 |
| 混雑グリッドが固定値 | 実態と乖離したまま表示 | 🟡 データ化または非表示化 |
| ストケロ君画像が空 | ヒーローエリアのレイアウトが崩れる | 🔴 画像用意 or 要素削除 |
| OGP画像なし | SNSシェア時に画像が出ない | 🔴 画像作成 |

---

## 実装ロードマップ

```
Phase 1（今すぐ・1〜2日）
  🔴 #1  Netlify Forms でフォーム送信を実装
  🔴 #2  OGP画像を作成して全ページに追加
  🔴 #3  ファビコンを設定
  🔴 #4  ストケロ画像を用意 or ヒーローから削除

Phase 2（1〜2週間以内）
  🟡 #5  料理写真を撮影してギャラリーを実装
  🟡 #6  sitemap.xml・robots.txt を作成
  🟡 #7  Google Search Console 登録
  🟡 #10 独自ドメインの取得・設定

Phase 3（安定後・1〜3ヶ月）
  🟢 #11 Netlify CMS でニュース投稿管理画面
  🟢 #13 Google Analytics 4 導入
  🟢 #14 LINE Login + スタンプのサーバー管理
  🟢 #15 予約管理ダッシュボード

Phase 4（Uber Eats出店後）
  🟢 #16 Uber Eats 連携
  🟢 #17 PWA 対応
```

---

## 参考：現在の完成済み機能 ✅

- [x] 静的マルチページ化（6ページ）
- [x] 共通CSS/JS分離（css/style.css, js/*.js）
- [x] data.js の軽量化（3MB → 16KB、base64除去）
- [x] モバイルファーストレスポンシブデザイン
- [x] ダークモード対応
- [x] カートシステム（localStorage、ページ間引き継ぎ）
- [x] スタンプカード・クーポン（localStorage）
- [x] 宴会プランページ・フォーム
- [x] ニュース個別ページ（5記事）
- [x] ニュース一覧ページ
- [x] 記事生成ツール（tools/news-creator.html）
- [x] WCAG 2.1 AA アクセシビリティ対応
  - [x] キーボード操作対応（スキップリンク、フォーカスリング）
  - [x] スクリーンリーダー対応（ARIA live regions、aria-label）
  - [x] 色覚多様性対応（CUD安全色＋形状インジケーター）
  - [x] prefers-reduced-motion 対応
  - [x] タッチターゲット 44×44px
  - [x] フォームラベル関連付け
- [x] BGMバー削除（非機能要素の除去）
- [x] 通知バナー（dismissible、sessionStorage記憶）
- [x] 構造化データ（JSON-LD）
- [x] パンくずナビ（全内部ページ）
- [x] スクロール進捗バー
- [x] FAQアコーディオン
