const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postroutes = require("./routes/posts"); 
const path = require("path");  

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use("/images", express.static(path.join("backend/images")));  

app.use(cors());
mongoose.connect("mongodb+srv://biglaeniyah10:rUhzp4N8TNtetlLF@cluster0.n2uls.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() =>{
        console.log('Connected to the database');
    })
    .catch(() =>{
        console.log('Connection Failed');
    })

// password rUhzp4N8TNtetlLF

app.use((req,res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");




        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
        next();
})




app.use(cors());


app.use("/api/posts", postroutes); // Use grouped routes


// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin',"*");
//     res.setHeader("Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept");
    
//         res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
//         next();
// })

// // app.post("/api/posts",(req, res, next) =>{
// //     const post = new Post({
// //         title: req.body.title,
// //         content: req.body.content
// //     });
// //     post.save();
// //     res.status(201).json({
// //         message: 'Post added successfully'
// //     })
// // })
// app.post("/api/posts", (req, res, next) =>{
//     const post =new Post({
//         title:req.body.title,
//         content: req.body.content
//     });
//     post.save().then(result=>{
//         res.status(201).json({
//             message: 'Post added succesfully',
//         });
//     })
   
// })

// app.put("/api/posts/:id", (req, res, next) => {
//     const post = {
//       title: req.body.title,
//       content: req.body.content
//     };
 
//     Post.updateOne({ _id: req.params.id }, post)
//       .then(result => {
//         console.log(result);
 
//         if (result.matchedCount > 0) {
//           res.status(200).json({ message: "Update Successful!" });
//         } else {
//           res.status(404).json({ message: "Post not found!" });
//         }
//       })
//       .catch(error => {
//         res.status(500).json({ message: "Updating post failed!", error: error });
//       });
//   });
 
 


// // app.use(cors());
// app.get('/api/posts', async (req, res) => {
//     try {
//         const posts = await Post.find();
//         res.status(200).json({ message: 'Posts successfully fetched', posts });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching posts', error });
//     }
// });


// app.get('/api/posts/:id', async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }
//         res.json(post);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching post', error });
//     }
// });


// // app.get("/api/posts", (req, res) => {
// //     Post.find()
// //         .then(documents =>{
// //             res.status(200).json({
// //                 message: 'Post succesfully fetched',
// //                 posts: documents
// //             })
// //         })
    
// // })

// app.delete("/api/posts/:id", (req, res, next) => {
//     Post.deleteOne({ _id: req.params.id}).then(result =>{
//         console.log(result);
//         console.log(req.params.id);
//         res.status(200).json({ message: "Post deleted"});
//     })
// })

module.exports = app;