#!/bin/bash

# .envファイルから環境変数を読み込む
if [ -f .env ]; then
    export $(cat .env | xargs)
else
    echo ".env file not found"
    exit 1
fi

# 環境変数が設定されているか確認
if [ -z "$GITHUB_TOKEN" ] || [ -z "$GITHUB_OWNER" ] || [ -z "$GITHUB_REPO" ]; then
    echo "Error: GITHUB_TOKEN, GITHUB_OWNER, or GITHUB_REPO is not set in .env file"
    exit 1
fi

# Pull Request の詳細を設定
PR_TITLE="Automated Pull Request"
PR_BODY="This is an automated pull request created by a script."
HEAD_BRANCH="feature-branch"
BASE_BRANCH="main"

# GitHub API URLを構築
API_URL="https://api.github.com/repos/$GITHUB_OWNER/$GITHUB_REPO/pulls"

# Pull Request を作成するAPIリクエスト
response=$(curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d "{
    \"title\": \"$PR_TITLE\",
    \"body\": \"$PR_BODY\",
    \"head\": \"$HEAD_BRANCH\",
    \"base\": \"$BASE_BRANCH\"
  }" \
  $API_URL)

# レスポンスを処理
if [ "$(echo $response | jq -r '.id')" != "null" ]; then
    echo "Pull Request created successfully!"
    echo "PR URL: $(echo $response | jq -r '.html_url')"
else
    echo "Failed to create Pull Request. Response:"
    echo $response | jq '.'
fi