import React, { useState } from "react";
import axios from "axios";

const CreateBlogPage = () => {
  const [post, setPost] = useState({
    title: "",
    content: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Assume the token is stored in localStorage

    if (!token) {
      alert("Please log in to create a post.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/blogs", // Assuming this is the route for creating posts
        post,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the Bearer token
          },
        }
      );
      alert("Post created successfully!");
      setPost({ title: "", content: "" }); // Reset form fields
    } catch (error) {
      console.error("There was an error creating the post:", error);
      alert("Error creating the post. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create a New Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={post.title}
            onChange={handleInputChange}
            placeholder="Enter the blog title"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="content">Content</label>
          <textarea
            className="form-control"
            id="content"
            name="content"
            value={post.content}
            onChange={handleInputChange}
            rows="5"
            placeholder="Enter the blog content"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreateBlogPage;
