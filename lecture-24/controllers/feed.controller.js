exports.getPosts = (req, res, next) => {
    res.json({
        posts: [
            {
                title: 'First post',
                content: 'This is the first post'
            },
            {
                title: 'Second post',
                content: 'This is the second post'
            }
        ]
    });
}

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    res.status(201).json({
        message: 'Post created successful',
        post: {
            id: new Date(),
            title: title,
            constent: content
        }
    });
}