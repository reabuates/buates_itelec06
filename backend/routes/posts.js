const express = require("express");
const multer = require("multer");  
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");  








const router = express.Router();








const MIME_TYPE_MAP = {  
  "image/png": "png",  
  "image/jpeg": "jpg",  
  "image/jpg": "jpg"  
};  








const storage = multer.diskStorage({  
  destination: (req, file, cb) => {  
    const isValid = MIME_TYPE_MAP[file.mimetype];  
    const error = isValid ? null : new Error("Invalid Mime Type");  
    cb(error, "backend/images");  
  },
  filename: (req, file, cb) => {  
    const name = file.originalname.toLowerCase().split(" ").join("_");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${name}-${Date.now()}.${ext}`);  
  }    
});  








const upload = multer({ storage });








router.post(
  "",
  checkAuth,  
  upload.single("image"),  
  async (req, res) => {
    try {
      const url = `${req.protocol}://${req.get("host")}`;
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: `${url}/images/${req.file.filename}`,
        creator: req.userData.userId  
      });




      const result = await post.save();
      res.status(201).json({
        message: "Post added successfully",
        post: {
          id: result._id,
          title: result.title,
          content: result.content,
          imagePath: result.imagePath,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Creating a post failed!",
        error: error.message
      });
    }
  }
);




router.put(
  "/:id",
  checkAuth,  
  upload.single("image"),  
  async (req, res) => {
    try {
      let imagePath = req.body.imagePath;
      if (req.file) {
        const url = `${req.protocol}://${req.get("host")}`;
        imagePath = `${url}/images/${req.file.filename}`;
      }
      const result = await Post.updateOne(
        { _id: req.params.id },
        { title: req.body.title, content: req.body.content, imagePath, creator: req.userData.userId   }
      );
      Post.updateOne({ _id: req.params.id,  
        creator: req.userData.userId }, post).then(result => {  
        if(result.nModified > 0){  
          res.status(200).json({ message: "Update successful!" });  
        }else{  
          res.status(401).json({ message: "Not Authorized!" });  
        }  
      });  
 




      if (result.matchedCount > 0) {
        res.status(200).json({ message: "Update Successful!" });
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Couldn't Update Post",
        error: error.message
      });
    }  
  }
);








router.get("/", (req, res) => {
  const pageSize = +req.query.pagesize;      
  const currentPage = +req.query.currentpage;
  let postQuery = Post.find();


  if (pageSize && currentPage) {
    postQuery = postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);                    
  }


  let documents;
  postQuery
    .then((result) => {
      documents = result;
     
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: documents,    
        maxPosts: count,      
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching posts failed", error });
    });
});




















router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
});


router.put("/:id/like", async (req, res) => {
  try {
    const postId = req.params.id;
    const likes = req.body.likes;


    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { likes: likes },
      { new: true }
    );


    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }


    res.status(200).json({ message: "Likes updated", post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Updating likes failed", error });
  }
});






router.delete("/:id", checkAuth, async (req, res) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {  
      if (result.nModified > 0) {  
        res.status(200).json({ message: "Delete successful!" });  
      } else {  
        res.status(401).json({ message: "Not Authorized!" });  
      }  
    })
    .catch(error => {  
      res.status(500).json({  
        message: "Deletion Not Done!"  
      });  
    });  
});


// Route to increment post views
router.put("/:id/view", async (req, res) => {
  try {
    const postId = req.params.id;
    console.log("Incoming request to increment views for post:", postId);


    const post = await Post.findById(postId);
    if (!post) {
      console.log("Post not found with ID:", postId);
      return res.status(404).json({ message: "Post not found" });
    }


    post.views = (post.views || 0) + 1;
    console.log("Updated views count:", post.views);


    const updatedPost = await post.save();


    res.status(200).json({ message: "Views incremented", views: updatedPost.views });
  } catch (error) {
    console.error("Error incrementing views:", error);
    res.status(500).json({ message: "Failed to increment views", error: error.message });
  }
});






















module.exports = router;





















