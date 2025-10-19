import React, { useState } from "react";
import { formatTimeAgo } from "../utils/timeUtils.js";
import CommentForm from "./CommentForm.jsx";

const Comment = ({ comment, onAddReply, onDelete, onUpvote, isTopLevel = false, user }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);

  // Handles the submission of a new reply
  const handleReplySubmit = (text) => {
    onAddReply(text, comment._id);
    setShowReplyBox(false);
  };
  
  // Determines if the current user can delete this comment
  const canDelete = user && user._id === comment.userId;
  // Determines if the current user has already upvoted this comment
  const isUpvoted = user && comment.upvotes.includes(user._id);

  return (
    <div className={`comment-container ${isTopLevel ? "top-level" : ""}`}>
      <img
        src={comment.avatar || `https://i.pravatar.cc/150?u=${comment.userId}`}
        alt={`${comment.username}'s avatar`}
        className="avatar"
      />
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-username">{comment.username}</span>
          <span className="comment-timestamp">{formatTimeAgo(comment.createdAt)}</span>
        </div>
        <p className="comment-text">{comment.text}</p>
        <div className="comment-actions">
           {/*UpVote button*/}
          <button 
            className={`upvote-btn ${isUpvoted ? 'upvoted' : ''}`} 
            onClick={() => onUpvote(comment._id)}
          >
            👍 {comment.upvotes.length}
          </button>
          {/*Reply button*/}
          <button className="reply-btn" onClick={() => setShowReplyBox(!showReplyBox)}>
            {showReplyBox ? "Cancel" : "Reply"}
          </button>
          {/*Delete button*/}
          {canDelete && (
            <button className="delete-btn" onClick={() => onDelete(comment._id)}>
              Delete
            </button>
          )}
        </div>
        
        {showReplyBox && <CommentForm onAdd={handleReplySubmit} />}

          {/* RECURSIVE RENDERING FOR NESTED REPLIES */}
        <div className="nested-replies">
          {comment.replies?.map((reply) => (
            // Recursion that creates the nested structure.
            <Comment
              key={reply._id}
              comment={reply}
              onAddReply={onAddReply}
              onDelete={onDelete}
              onUpvote={onUpvote}
              user={user}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comment;