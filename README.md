# Questionnaire 動態問卷

本專案為一套動態問卷系統，包含 **Angular 17 前端** 與 **Spring Boot 後端（MySQL 資料庫）**，支援問卷建立、作答、統計分析與前台使用者、後台管理者分權操作。

---

## 專案功能

### ● 前台（使用者）
- 模糊搜尋公開問卷
- 動態作答支援多題型（單選、多選、填空）
- 回答送出後可即時瀏覽統計圖表（Chart.js）

### ● 後台（管理者）
- 登入後管理問卷與題目（新增、修改、刪除）
- 模糊搜尋所有問卷
- 檢視每份問卷的答題回饋與統計
- 管理作答紀錄與內容

---

## 使用技術

### 前端 Frontend
- Angular 17
- Angular Material
- Chart.js
- HTML / SCSS / TypeScript


### 後端 Backend
- Spring Boot (Java)
- MySQL Database
- JPA / Hibernate
- RESTful API

---

## 專案結構

### 前端 Frontend（[Repo](https://github.com/chenyi1221/Questionnaire)）

### 後端 Backend（[Repo](https://github.com/chenyi1221/quiz14)）

---

## 快速開始（後端）

1. 建立 MySQL 資料庫：

   
sql
   CREATE DATABASE quiz14 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   


2. 匯入建表與假資料：

   - 將 schema.sql 和 data.sql 放入 src/main/resources/
   - 使用 MySQL Workbench 或 CLI 匯入也可以

3. 修改 `src/main/resources/application.yml`：

   
yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/quiz14
       username: root
       password: yourpassword
     jpa:
       hibernate:
         ddl-auto: none
       show-sql: true
   


4. 啟動 Spring Boot 專案：

   
bash
   ./mvnw spring-boot:run
   


---

## 快速開始（前端）

1. 進入前端專案資料夾：

   
bash
   cd frontend
   


2. 安裝套件（含 Chart.js 與 Angular Material）：

   
bash
   npm install
   npm install chart.js
   ng add @angular/material
   


3. 啟動 Angular 專案：

   
bash
   ng serve
   


4. 預設網址：

   

   http://localhost:4200

---

## 注意事項

- 問卷列表需搭配 Angular Material 正確顯示
- 問卷統計圖表需搭配 Chart.js 正確顯示
