const mongoose = require('mongoose');


const commentSchema = mongoose.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });


const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, required: true },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      comments: [commentSchema],
      likes: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
    });
   


module.exports = mongoose.model('Post', postSchema);

