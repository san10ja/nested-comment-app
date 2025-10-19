import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: String, required: true },      
  username: { type: String, required: true },    
  avatar:{type:String, required:true},
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment',                       
    default: null                         // Top-level (parent) comments will have a null value
  },
  upvotes: [{ 
    type: mongoose.Schema.Types.ObjectId, // Stores the user ID
    ref: 'User' 
  }],
  
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Comment", commentSchema);