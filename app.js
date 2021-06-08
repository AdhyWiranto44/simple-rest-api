require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post = require('./models/Post.js');
const PORT = 3000;

const app = express();

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/api/posts", (req, res) => {
    Post.find().sort({created_at: -1}).exec() // cari semua data

    .then((foundPosts) => {
        if (foundPosts.length < 1) { // jika tidak ada data
            res.status(404).json({
                'message': "Posts unavailable!"
            });
        } else {
            res.status(200).json({ // jika ketemu, tampilkan
                'message': "Posts found!",
                'data': foundPosts
            });
        }
    })

    .catch(err => { // error handling
        res.status(500).json({
            'message': 'Error: ' + err
        });
    });
});

app.post('/api/posts', (req, res) => {
    // mempersiapkan data post baru
    const newPost = new Post({
        title: req.body.title,
        slug: req.body.title.replace(/\s+/g, '-').toLowerCase(),
        body: req.body.body,
        created_at: new Date,
        updated_at: new Date,
    });

    Post.find({slug: newPost.slug}).exec() // cek dahulu apakah sudah ada post title yang sama

    .then(foundPost => {
        if (foundPost.length > 0) { // jika ada
            res.status(400).json({
                'message': 'There is post title like your input, please try again with another title.'
            });
        } else {
            return newPost.save(); // jika belum ada, maka tambahkan post baru
        }
    })
    
    .then(() => {
        res.status(200).json({
            'message': "Posts added successfully!"
        });
    })

    .catch((err) => { // error handling jika inputan tidak sesuai
        res.status(400).json({
            'message': err.toString().split(",")
        });
    });
});

app.get('/api/posts/:postSlug', (req, res) => {
    Post.find({slug: req.params.postSlug}).exec() // cari data berdasarkan slug

    .then((foundPosts) => {
        if (foundPosts.length < 1) { // jika tidak ada data
            res.status(404).json({
                'message': "Posts unavailable!"
            });
        } else {
            res.status(200).json({ // jika ketemu, tampilkan
                'message': "Posts found!",
                'data': foundPosts
            });
        }
    })

    .catch(err => { // error handling
        res.status(500).json({
            'message': 'Error: ' + err
        });
    });
});

app.put('/api/posts/:postSlug', (req, res) => {
    // cari post lalu update berdasarkan slug-nya
    Post.findOneAndUpdate(
        {slug: req.params.postSlug}, 
        {
            title: req.body.title,
            body: req.body.body,
            updated_at: new Date()
        }
        ).exec()

    .then(previousPost => {
        if (previousPost) { // jika berhasil diubah, ditandai dengan data sebelumnya akan dikembalikan
            res.status(200).json({
                'message': 'Post updated successfully!',
                'previous_data': previousPost
            });
        } else { // jika gagal diubah, ditandai data sebelumnya tidak ditemukan
            res.status(400).json({
                'message': 'There is no such post!'
            });
        }
    })

    .catch((err) => { // error handling
        res.status(500).json({
            'message': err
        });
    });
});

app.delete('/api/posts/:postSlug', (req, res) => {
    Post.findOneAndDelete({slug: req.params.postSlug}).exec() // cari dan hapus 1 data berdasarkan slug-nya

    .then(deletedPost => {
        if (deletedPost) { // jika berhasil dihapus
            res.status(200).json({
                'message': 'Post deleted successfully!',
                'deleted_post': deletedPost
            });
        } else { // jika gagal dihapus
            res.status(400).json({
                'message': 'Cannot delete post because the post does not found.'
            });
        }
    })

    .catch((err) => { // error handling
        res.status(500).json({
            'message': err
        });
    });
});

app.get('*', (req, res) => {
    res.status(404).json({
        'message': 'Not found.'
    });
});

app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${PORT}`);
});