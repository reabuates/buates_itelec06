const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.get("/api/posts", (req, res) => {
    const posts = 
        [
            {
            id: "rea",
            title: "first title from server-side",
            content: "second content from server-side"
        },
        {
            id: "buates",
            title: "first title from server-side",
            content: "second content from server-side"
        }

        ];
    

    res.status(200).json({
        message: 'Posts successfully fetched',
        posts: posts 
    });
})

module.exports = app;