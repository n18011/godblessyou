# API仕様書

## 認証API

### ユーザー登録
新規ユーザーを登録し、JWTトークンを発行します。

```
POST /api/auth/register
```

#### リクエストボディ
```json
{
  "email": "string",    // メールアドレス（必須）
  "password": "string", // パスワード（必須）
  "name": "string"      // ユーザー名（必須）
}
```

#### レスポンス
**成功時** (200 OK)
```json
{
  "token": "string",  // JWTトークン
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "USER" | "ADMIN"
  }
}
```

**エラー時**
- 400 Bad Request
```json
{
  "error": "必須項目が不足しています" | "このメールアドレスは既に登録されています"
}
```
- 500 Internal Server Error
```json
{
  "error": "サーバーエラーが発生しました"
}
```

### 認証ヘッダー
保護されたエンドポイントにアクセスする際は、以下のヘッダーが必要です：
```
Authorization: Bearer <token>
```

## エラーレスポンス
すべてのエンドポイントで共通のエラーレスポンス形式：
```json
{
  "error": "エラーメッセージ"
}
```

## レート制限
- リクエスト制限: 100回/分
- 制限超過時のレスポンス: 429 Too Many Requests 