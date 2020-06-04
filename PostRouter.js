const express = require('express');

const router = express.Router()

const Db = require("./data/db.js");

router.get('/', (req, res) => {
    Db.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            res.status(500).json({
                error: "The posts information could not be retrieved."
            })
        })
})
router.get('/:id', (req, res) => {
    id = req.params.id
    Db.findById(id)
        .then(posts => {
            if(posts.length === 0){
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            } else {
                res.status(200).json(posts)
            }   
        })
        .catch(error => {
            res.status(500).json({
                message: "The post with the specified ID does not exist."
            })
        })
})

router.get("/:id/comments", (req, res) => {
    id= req.params.id
   
    Db.findById(id)
        .then(post => {
            if(post.length === 0){
                res.status(400).json({
                    message: "The post with the specified ID does not exist."
                })
            } else {
                Db.findPostComments(id)
                .then(comment => {
                    if(comment.length === 0){
                        res.status(404)
                    } else {
                        res.status(200).json(comment)
                    }
                }).catch(error => {
                    res.status(500).json(error)
                })
               
            }
        }).catch(error => {
            res.status(500).json(error)})
})


router.post("/", (req, res) => {
    const post = req.body;
    if (!post || !post.title || !post.contents) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    } else {
        Db.insert(post)
            .then(id => {
                Db.findById(id)
                    .then(post => {
                        res.status(201).json(post)
                    }).catch(error => {
                        res.status(500).json({
                            errorMessage: error
                        })
                    })
            }).catch(error => {
                res.status(500).json({
                    errorMessage: error
                })
            })
    }
})


router.post("/:id/comments", (req, res) => {
    const id = req.params.id;
    const comment = req.body;
    const newComment = {...comment, post_id: id}
    Db.findById(id)
        .then(post => {
            if (post.length === 0) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            } else if (!comment.text) {
                res.status(400).json({
                    errorMessage: "Please provide text for the comment."
                })
            } else { 
                Db.insertComment(newComment)
                .then(comm => {
                    res.status(201).json(comm)
                }).catch(error => {
                    res.status(500).json({
                        error: "There was an error while saving the comment to the database"})
                })
            }
        })
})

router.delete("/:id", (req, res) => {
    const id = req.params.id
    Db.findById(id)
        .then(post => {
            const deletedPost = post;
            if(post.length === 0) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }else{
                Db.remove(id)
                .then(count => {
                    res.status(200).json(deletedPost)
                }).catch(err => {
                    res.status(500).json({
                        error: "The post could not be removed"
                    })
                })
            }
        })
})

router.put("/:id", (req, res) => {
    const id = req.params.id
    const contents = req.body
    Db.findById(id)
        .then(post => {
            if(post.length == 0) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            } else{
                Db.update(id, {
                    id: id,
                    ...contents
                }).then(count => {
                    if(count === 1){
                        Db.findById(id)
                        .then(post => {
                            res.status(200).json(post)
                        })
                        
                    }
                })
            }
        })
})
module.exports = router;
