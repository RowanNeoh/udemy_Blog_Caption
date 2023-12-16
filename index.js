import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
/*import { fileURLToPath } from "url";
import { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));*/
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://rowanneoh:WL.GtYzcsU455sU@clusterwebdb.sdgtka1.mongodb.net/webProject', { useNewUrlParser: true, useUnifiedTopology: true });
// Event handlers for connection status
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});

const postSchema = new mongoose.Schema({
    postMsg: String,
    name: String,
    email: String,
    website: String,
}, {
    collection: 'blog', // Specify the collection name
    timestamps: true,    // Optional: Add timestamps for createdAt and updatedAt
});
const post = mongoose.model('Post', postSchema);

app.get("/", async(req, res) => {
    const blogs = await post.find();
    //console.log("blogs: "+blogs);
  res.render("index.ejs",{blogs: blogs});
});

app.post("/submit", async (req, res) => {
    try {
        const postMsg = req.body["postMsg"];
        const name = req.body["name"];
        const email = req.body["email"];
        const website = req.body["website"];
        console.log(postMsg+","+name);
        const newPost = new post({
            postMsg: postMsg,
            name: name,
            email:email,
            website:website,
        });
        // Save the new post to the database
        await newPost.save();
    
        //console.log("postMsg"+postMsg);
        const blogs = await post.find();
        res.render("index.ejs",{blogs: blogs});
    }catch (error) {
        console.error("Error saving post to MongoDB:", error);
        res.status(500).send("Internal Server Error");
    }
  
  });

  app.post("/edit", async (req, res) => {
    try {
        const id = req.body["_id"];  
        const action = req.body["btnAction"];  
        
        if (action == "delete"){            
            ///const postId = new mongoose.Types.ObjectId(req.body["_id"]);  
            if (mongoose.isValidObjectId(req.body["_id"])) {
                console.log("ID: "+req.body["_id"]);
                await post.deleteOne({_id: req.body["_id"]}); 
            }        

            const blogs = await post.find();
            //console.log(blogs);
            res.render("index.ejs",{blogs: blogs});
        }else{
            const blogs = await post.find();        
            res.render("editPost.ejs",{_id: id, blogs:blogs});
        }        
    }catch (error) {
        console.error("Error saving post to MongoDB:", error);
        res.status(500).send("Internal Server Error");
    }
  
  });  


  app.post("/save", async (req, res) => {
    try {
        const id = req.body["_id"]
        const postMsg = req.body["editMsg"];
        const name = req.body["name"];
        const email = req.body["email"];
        const website = req.body["website"];
        const action = req.body["btnAction"]; 

        // Check if the post with the given name already exists
        //const existingPost = await post.findOne({ name: name });
        const existingPost = await post.findOne({ _id: id });
         
        
        if (action == "delete"){            
            ///const postId = new mongoose.Types.ObjectId(req.body["_id"]);  
            if (mongoose.isValidObjectId(req.body["_id"])) {
                console.log("ID: "+req.body["_id"]);
                await post.deleteOne({_id: req.body["_id"]}); 
            }        

            const blogs = await post.find();
            //console.log(blogs);
            res.render("index.ejs",{blogs: blogs});
        }else{
            if (existingPost) {
                // If it exists, update the existing post
                existingPost.postMsg = postMsg;
                //existingPost.email = email;
                //existingPost.website = website;
    
                await existingPost.save();
            } else {
                // If it doesn't exist, create a new post
                const newPost = new post({
                    postMsg: postMsg,
                    name: name,
                    email: email,
                    website: website,
                });
    
                // Save the new post to the database
                await newPost.save();
            }
        }        

        // Fetch all posts after the update
        const blogs = await post.find();
        res.render("index.ejs", { blogs: blogs });
    } catch (error) {
        console.error("Error saving/updating post to MongoDB:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
  
  