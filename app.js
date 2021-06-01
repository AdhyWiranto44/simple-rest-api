require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post = require('./models/Post.js');

const app = express();

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", (req, res, next) => {
    try {
        Post.find().exec()
    
        .then((foundPosts) => {
            if (foundPosts.length < 1) {
                res.status(404).json({
                    'message': "Posts unavailable!"
                });
            } else {
                res.status(200).json({
                    'message': "Posts found!",
                    'data': foundPosts
                });
            }
        })
    
        .then(null, next);
    } catch (err) {
        res.status(400).json({
            'message': 'Error: ' + err
        })
    }
});

app.post('/new-post', (req, res, next) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            slug: req.body.title.replace(/\s+/g, '-').toLowerCase(),
            body: req.body.body,
            created_at: new Date,
            updated_at: new Date,
        });

        Post.find({slug: newPost.slug}).exec()

        .then(foundPost => {
            if (foundPost.length > 0) {
                res.status(400).json({
                    'message': 'Please change the post title'
                });
            } else {
                newPost.save();
            }
        })
        
        .then(() => {
            res.status(200).json({
                'message': "Posts added successfully!"
            });
        })
    
        .then(null, next);
    } catch(err) {
        res.status(500).json({
            'message': 'Failed to add new post, input undefined!'
        });
    }
});

app.delete('/delete-post/:postSlug', (req, res, next) => {
    try {
        Post.find({slug: req.params.postSlug}).exec()

        .then(foundPost => {
            if (foundPost.length > 0) {
                Post.remove({slug: req.params.postSlug}).exec();
            } else {
                res.status(400).json({
                    'message': 'Cannot delete post because the post does not found.'
                })
            }
        })

        .then(() => {
            res.status(200).json({
                'message': 'Post deleted successfully!'
            })
        })

        .then(null, next);

    } catch(err) {
        res.status(500).json({
            'message': err
        });
    }
});

app.get('*', (req, res) => {
    res.status(404).json({
        'message': 'Not found.'
    })
})

app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`);
});