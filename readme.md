# Simple REST API

Project boilerplate untuk membangun Backend REST API menggunakan Node.js, Express, dan Mongodb.

## Studi kasus
Pengelolaan blog

## Software yang harus diinstall
- MongoDB
- Node.JS
- Module nodemon yang diinstall secara global

```
# Routes
GET      /api/posts
POST     /api/posts
GET      /api/posts/:slug
PUT      /api/posts/:slug
DELETE   /api/posts/:slug

```

## Pengingat
- Jangan lupa jalankan MongoDB mu

## Konfigurasi

```
# Install dependencies
npm install

# Install Nodemon
npm install -g nodemon

# Setup Environment Variable
mv .env.example .env

# Konfigurasi .env
- uncomment DB_NAME
- ganti nama yourDBName sesuai dengan keinginan, misalkan simpleblogDB

# Run
npm start

```

## Contoh penggunaan
- Kamu bisa menggunakan POSTMAN untuk mencoba Endpoints yang tersedia, misalkan untuk menambahkan data dapat menggunakan metode request POST dengan Endpoint http://localhost:3000/api/posts. 
- Setelah itu coba tambahkan data baru di tab Body lalu pilih option x-www-form-urlencoded. 
- Lalu isi form di tabel Key Value dengan data <b>title</b> dan <b>body</b>
- Send Request
