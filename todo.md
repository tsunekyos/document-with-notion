***Notionの更新差分を、GitHubのPRにする***

--- 

# notionの内容を取得する
[] notionAPIを叩いて、output.mdにして保存
# GitHubにPRを作る
[] コマンドを叩いて、PRを作成させる
[x] ドキュメント用repoを用意する
[] GHAを作動させると、test.txtの末尾に今の時間を追加してPRが作られるようにする
[] GHAを外からコマンドで叩けるようにする
# 連携させる
[] GHAを叩くと、notionAPIを叩いて対象ページの差分を取得、PRが作られるようにする
# 定期実行させる
[] 定期的に作ったGHAを叩いてくれる