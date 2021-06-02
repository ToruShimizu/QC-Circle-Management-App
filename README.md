# Name

QC-Circle-Management-App

## Overview

このアプリは QC サークル活動（小集団改善活動）を管理するアプリです。  
(QC サークルとは同じ職場内で品質管理活動を自発的に小グループで行う活動です。)

## DEMO

- 接続先 URL: <https://qc-circle-management-app.netlify.app>

![デモ動画](https://user-images.githubusercontent.com/65491855/100514423-e70b8480-31b7-11eb-9cd4-fe30b11b9249.gif)

## Description

このアプリでは、QC サークル活動における様々なタスクの進捗管理を行うことができます。

- QC サークルの作成
- QC サークルメンバーの名前、サークル内の役割の登録
- QC サークル活動の活動計画の作成
- 活動計画の進捗管理
- 改善事例作成のタスク管理

## Features

1. **ログイン**
   1. 「テストユーザーとしてログイン」を選択されますとそのままログインできます。
   2. テストユーザー以外でログインする場合は新規作成、各種ログイン機能をご利用ください。
   3. ログイン後、左側のサイドメニューよりログインユーザーの編集が行えます（テストユーザーは不可）。  
      ![ログイン画面](https://user-images.githubusercontent.com/65491855/100514762-b11bcf80-31ba-11eb-87bc-aa9fca87f2fc.png)
2. **サークル作成**
   1. ログイン後に表示される、サークル新規作成をクリックしてサークルを作成します。
   2. サークル作成後にサークル名の右側のアイコンより編集、削除を行うことができます。
   3. サークル作成後、サークルメンバーの登録、編集、削除を行うことができます。  
      ![サークル表示画面](https://user-images.githubusercontent.com/65491855/100514697-220eb780-31ba-11eb-8938-4e77863d55a0.png)
3. **活動計画作成**
   1. 活動計画の一覧表示画面では活動計画の作成、編集、削除を行うことができます。
   2. 活動計画のタイトル右側にあるアイコンを選択されますとコメント機能を利用することができます。  
      ![活動計画一覧画面](https://user-images.githubusercontent.com/65491855/100514654-fb508100-31b9-11eb-992c-e904c1654d25.png)
4. **機能一覧**
   - ユーザー登録、ログイン機能
   - 投稿機能
     - テキスト
     - 画像
   - コメント機能
   - ページネーション機能
   - タスクの状態管理
   - 検索機能
   - 絞り込み機能
   - ソート機能
5. **実装予定機能**
   - スタンプ機能
   - ブックマーク機能
   - タスクの期限通知機能
   - ユーザー間のデータの共有化
   - 活動計画作成時の担当メンバー選択時にサークル内の役割も連動させて自動入力する。
   - サークルメンバー登録を Firebase に登録されているユーザー情報で行えるようにする。

## Requirement

| Package |   Ver.    |
| :-----: | :-------: |
|  Node   | "14.15.1" |
|   npm   | "6.14.9"  |

## Installation

```
$ nodebrew install-binar v14.15.1
$ npm install -g npm@6.14.8
```

## Usage

```
$ git clone https://github.com/ToruShimizu/QC-Circle-Management-App.git
$ cd QC-Circle-Management-App
$ npm run dev
```

## Technology

| Framework |   Ver.   |
| :-------: | :------: |
|  Nuxt.js  | "2.14.7" |
|  Vuetify  | "1.11.2" |

- DB
  - Firebase

## Author

- [@ToruShimizu](https://github.com/ToruShimizu)
