import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Swal from "sweetalert2";

const ViewBlog = ({ user }) => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");

  // Extract isAdmin directly from user object to ensure it's always accurate
  const isAdmin = user && user.isAdmin;

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `https://blogpostapi-3mjz.onrender.com/blogs/${postId}`
      );
      setPost(response.data);
      console.log(post, "here fetch viewblog");
    } catch (err) {
      console.error("Error fetching post:", err);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") {
      alert("Comment cannot be empty!");
      return;
    }

    try {
      await axios.post(
        `https://blogpostapi-3mjz.onrender.com/blogs/${postId}/comments`,
        {
          text: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setNewComment("");
      fetchPost(); // Refresh comments after adding
      Swal.fire({
        icon: "success",
        title: "Comment Added!",
        text: "Your comment has been successfully added.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `https://blogpostapi-3mjz.onrender.com/blogs/${postId}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchPost();

      Swal.fire({
        icon: "success",
        title: "Comment Deleted!",
        text: "The comment has been successfully deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error deleting comment:", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to delete the comment.",
      });
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>Author: {post.author.username}</p>

      <h3>Comments</h3>
      <div className="comments-list">
        {post.comments.map((comment) => (
          <div key={comment._id} className="comment">
            <p>{comment.text}</p>
            <p>By: {comment.author.username}</p>{" "}
            {/* Changed to display username */}
            {isAdmin && (
              <Button onClick={() => handleDeleteComment(comment._id)}>
                Delete Comment
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Input section for adding a new comment */}
      <div className="add-comment-section">
        <h4>Add a Comment</h4>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Type your comment here..."
          rows="4"
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <Button onClick={handleAddComment}>Submit Comment</Button>
      </div>
    </div>
  );
};

export default ViewBlog;
