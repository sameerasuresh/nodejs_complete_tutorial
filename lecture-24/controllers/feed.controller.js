exports.getPosts = (req, res, next) => {
    console.log('test1')
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