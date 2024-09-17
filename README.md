# document-with-notion

## 概要
このリポジトリは、Notion APIを使用してNotionのデータベースから情報を取得し、マークダウンファイルに変換して、GitHubリポジトリに自動的にプルリクエストを作成するプロジェクトです。GitHub Actionsを使用して、このプロセスを自動化しています。

## 機能
- Notionの特定データベースからページ情報を取得
- 取得したページ情報をマークダウン形式に変換
- 変換されたマークダウンファイルをこのリポジトリに追加・更新
- 変更内容をプルリクエストとして作成

## GitHub Secretsの設定
以下の値をリポジトリのSecretsに設定してください：

- `NOTION_API_KEY`: NotionのAPI Key
- `NOTION_DB_ID`: 対象となるNotionデータベースのID
- `PAT`: GitHub Personal Access Token（リポジトリへの書き込み権限が必要）

## 使用方法
GitHub Actionsワークフローを手動でトリガーすることで、Notionデータの取得、マークダウンへの変換、プルリクエストの作成が実行されます。

