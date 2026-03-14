# grouped_index API 仕様と表示計画

## API概要

### エンドポイント
```
GET /api/v2/feeds/grouped_index
GET /api/v2/feeds/grouped_index?position={feed_id}
GET /api/v2/feeds/grouped_index?position={feed_id}&grouping_id={grouping_id}
```

### レスポンス構造

```typescript
type FeedIndex = FeedIndexItem[];

// グループ化されたフィード（日報グループなど）
interface GroupedFeedItem {
  grouped: true;
  feed_group: {
    id: number;
    title: string;           // "【日報】スタメン全社"
    feed_ids: number[];      // フィードIDの配列
    base_date: string;
    icon_path: string[];
  };
  feeds?: Feed[];            // インラインでフィードデータが含まれる場合あり
}

// 単独フィード
interface UngroupedFeedItem {
  grouped: false;
  feeds: Feed[];             // 完全なフィードデータの配列
}
```

## ページネーション

### 現状の挙動
- 初回リクエスト: 最初の2グループのみ返却
- 続きを取得するには `position` パラメータが必要

### HARで確認されたリクエスト例
```
/feeds/grouped_index                                    → 初回（2件）
/feeds/grouped_index?position=23751208                  → 続き
/feeds/grouped_index?position=23759059&grouping_id=xxx  → 特定グループの続き
```

## 確認されたフィードグループ

| グループ名 | template_type | 件数例 |
|-----------|---------------|--------|
| 【日報】スタメン全社 | daily_report_template | 92 |
| フォト＆ムービー | - | 6 |
| サンクスメッセージ | thanks_template | 16 |
| スタメンライブラリー | basic_template | 3 |
| 本日の勤務連絡 | basic_template | 28 |
| 1on1 | basic_template | - |
| メール連携情報 | html_mail_template | - |
| 注目を集めた投稿 | - | - |
| 採用通信 | basic_template | - |
| NEWスターメンバー | daily_report_template | - |

## Substance タイプ

各フィードの `apply.substances` に含まれるフィールドタイプ:

| item_type | 説明 | 値の例 |
|-----------|------|--------|
| textarea | テキストエリア | 本文テキスト |
| text | テキスト | 拠点名など |
| date | 日付 | "2026年03月12日(木)" |
| selectbox | 選択肢 | "More and Better" |
| user_list | ユーザーリスト | (値は空、別フィールドに実データ) |
| image_select | 画像選択 | 画像URL |
| mail | HTMLメール | mail.tunag.jp のURL |
| pickup | 投稿ピックアップ | (値は空) |
| poll | 投票 | - |
| check | チェック | - |
| profile | プロフィール | - |

### 特殊タイプの実データ位置

`user_list`, `image_select` などは `apply` オブジェクト内の別フィールドに実データがある:

```typescript
interface Apply {
  substances: Substance[];
  // 特殊タイプの実データ
  substance_user_lists: SubstanceUserList[];
  substance_image_selects: SubstanceImageSelect[];
  substance_pickups: unknown[];
  substance_pickup_items: unknown[];
  substance_polls: unknown[];
}
```

## 表示計画

### Phase 1: 基本実装（現状）
- [x] grouped_index から feed_ids を抽出
- [x] 個別にフィードを取得して表示
- [x] Markdown レンダリング
- [x] 画像表示
- [x] 無限スクロール

### Phase 2: ページネーション対応
- [ ] grouped_index のページネーション実装
- [ ] `position` パラメータを使った続きの取得
- [ ] すべてのグループタイプを取得可能に

### Phase 3: インラインフィード活用
- [ ] UngroupedFeedItem の `feeds` 配列を直接使用
- [ ] GroupedFeedItem の `feeds` がある場合は直接使用
- [ ] API呼び出し回数の削減

### Phase 4: 特殊タイプ対応
- [ ] user_list: ユーザーアイコン・名前表示
- [ ] image_select: サンクスカードデザイン表示
- [ ] mail: HTMLメールのプレビューまたはリンク
- [ ] pickup: 参照投稿の表示

### Phase 5: 追加機能
- [ ] グループ別フィルタリング
- [ ] 既読管理（読み取り専用で表示）
- [ ] ブックマーク・必読バッジ表示

## 注意事項

1. **API呼び出し頻度**: 現状は feed_ids ごとに個別API呼び出し。インラインフィードを活用すれば削減可能。

2. **読み取り専用**: POST リクエスト（既読マーク等）は安全のため実装しない。

3. **認証**: tunag.jp にログイン済みのCookieが必要。Chrome拡張のコンテキストで動作。
