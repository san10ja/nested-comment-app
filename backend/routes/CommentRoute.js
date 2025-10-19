import express from "express";
import Comment from "../models/comment.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// CREATE: Post a new comment or a reply
router.post("/", async (req, res) => {
  try {
    const { text, userId, username, avatar, parentId } = req.body;
    if (!text || !userId || !username) {
      return res.status(400).json({ message: "Missing required comment data." });
    }
    const comment = new Comment({ text, userId, username, avatar, parentId });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// READ: Fetch all comments and structure them into a nested hierarchy
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    const commentMap = {};
    const nestedComments = [];

    comments.forEach(comment => {
      commentMap[comment._id] = { ...comment._doc, replies: [] };
    });

    comments.forEach(comment => {
      if (comment.parentId) {
        const parent = commentMap[comment.parentId];
        if (parent) {
          parent.replies.push(commentMap[comment._id]);
        }
      } else {
        nestedComments.push(commentMap[comment._id]);
      }
    });
    res.json(nestedComments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments." });
  }
});

// DELETE: Delete a comment and all its nested children
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const idsToDelete = [id];

    const findChildrenIds = async (parentId) => {
      const children = await Comment.find({ parentId });
      for (const child of children) {
        idsToDelete.push(child._id);
        await findChildrenIds(child._id);
      }
    };

    await findChildrenIds(id);
    await Comment.deleteMany({ _id: { $in: idsToDelete } });
    res.status(200).json({ message: "Comment and replies deleted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment.", error: error.message });
  }
});

// UpVote: toggles a user's upvote on a specific comment
router.patch("/:id/upvote", authMiddleware, async (req, res) => {
  try {
    console.log("Upvote Route: Received req.user:", req.user);
    
    if (!req.user || !req.user.id) {
        return res.status(403).json({ message: "User ID not found after authentication." });
    }

    const { id } = req.params;
    const userId = req.user.id; 

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    const upvotedIndex = comment.upvotes.indexOf(userId);
    if (upvotedIndex === -1) {
      comment.upvotes.push(userId);
    } else {
      comment.upvotes.splice(upvotedIndex, 1);
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error during upvote." });
  }
});

export default router;
