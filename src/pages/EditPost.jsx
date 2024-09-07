import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Button } from "react-bootstrap";

const EditPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `https://blogpostapi-3mjz.onrender.com/blogs/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const postData = response.data;
      console.log(postData, "here edit post");

      setPost({ title: postData.title, content: postData.content });
      setIsAuthorized(true); // Set the authorized state to true

      setLoading(false);
    } catch (err) {
      console.error("Error fetching post:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://blogpostapi-3mjz.onrender.com/blogs/${postId}`,
        { title: post.title, content: post.content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Post Updated",
        text: "Your post has been updated successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      // No navigation needed here; success message will suffice
    } catch (err) {
      console.error("Error updating post:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error updating the post.",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit Post</h2>
      {isAuthorized ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle" className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              name="title"
              value={post.title}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formContent" className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter content"
              name="content"
              value={post.content}
              onChange={handleInputChange}
              rows="5"
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mb-3">
            Update Post
          </Button>
        </Form>
      ) : (
        <p>You are not authorized to edit this post.</p>
      )}
      <div>
        <Link to="/blogPostList">
          <Button>Back to Blog Posts List</Button>
        </Link>
      </div>
    </div>
  );
};

export default EditPost;
