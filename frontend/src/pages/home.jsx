import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentForm from "../components/CommentForm.jsx";
import Comment from "../components/Comment.jsx";
import "../style.css";

const Home = ({ user, onLogout }) => {
  const [comments, setComments] = useState([]);
  const token = localStorage.getItem("token");
// Fetches all comments from the backend API.
  const fetchComments = async () => {
    try {
      const res = await axios.get("https://nested-comment-app.onrender.com/api/comments");
      setComments(res.data);
    } catch (err) { console.error("Error fetching comments:", err); }
  };

  useEffect(() => { fetchComments(); }, []);

  // adding a new comment or a reply.
  const handleAddComment = async (text, parentId = null) => {
    if (!user) return alert("You must be logged in to comment.");
    try {
      await axios.post("https://nested-comment-app.onrender.com/api/comments", 
        { text, parentId, userId: user._id, username: user.username, avatar: user.avatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments();// Re-fetch comment
    } catch (err) { alert(`Failed to post comment: ${err.response?.data?.message}`); }
  };
  
  // Handles the deletion of a comment.
  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axios.delete(`https://nested-comment-app.onrender.com/api/comments/${commentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchComments();// Re-fetch comments 
      } catch (err) { alert(`Failed to delete comment: ${err.response?.data?.message}`); }
    }
  };

  // Handles upvoting a comment.
  const handleUpvoteComment = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return alert("You must be logged in to upvote. Your session may have expired.");
    }
    
    try {
      await axios.patch(`https://nested-comment-app.onrender.com/api/comments/${commentId}/upvote`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchComments(); 
    } catch (err) {
      alert(`Failed to upvote: ${err.response?.data?.message || 'Please try again.'}`);
    }
  };

  return (
    <div className="comment-thread">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        
        <div className="post-thread">
          <div className="Header_out">
          <h1>Community Discussion</h1>
           
        <button className="btn_log_out"
          onClick={onLogout} 
          style={{
            height: 'fit-content', 
            cursor: 'pointer', 
            padding: '8px 16px', 
            borderRadius: '5px', 
            border: 'none', 
            backgroundColor: '#dc3545', 
            color: 'white'
          }}
        >
          Logout
        </button></div>
      <img src="/postImage.jpg" alt="A descriptive alt text" />
      <p>Nested comments allow users to reply directly to other comments, creating threaded conversations within a larger discussion. Each reply is visually indented under its parent comment, forming a clear hierarchical structure that shows who is responding to whom. This system makes it easy to follow specific lines of conversation and maintain context, preventing the discussion from becoming a confusing, flat list. Platforms like Reddit heavily rely on this model to organize user interactions.</p>

    </div>
      
       
      </div>

      <CommentForm onAdd={handleAddComment} />
      <hr style={{ border: '1px solid #444', margin: '2rem 0' }} />
      {/* Maps over the `comments` array to render each top-level comment. */}
      {comments.map((comment) => (
        // The `Comment` component is used to display each comment and its replies.
        <Comment
          key={comment._id}
          comment={comment}
          onAddReply={handleAddComment}
          onDelete={handleDeleteComment}
          onUpvote={handleUpvoteComment}
          isTopLevel={true}
          user={user}
        />
      ))}
    </div>
  );
};

export default Home;