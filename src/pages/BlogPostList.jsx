import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import { Card } from 'react-bootstrap';
import UserContext from '../UserContext'; // Import the UserContext

const BlogPostsList = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserContext); // Use context to get user

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/blogs');
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:4000/blogs/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure token is sent with the request
        },
      });
      setPosts(posts.filter((post) => post._id !== postId));

      Swal.fire({
        icon: 'success',
        title: 'Post Deleted!',
        text: 'The post has been successfully deleted.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  return (
    <div>
      <h1>All Blog Posts</h1>
      <div className="posts-list">
        {posts.map((post) => (
          <Card key={post._id} className="mb-3">
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Text>{post.content}</Card.Text>
              <Card.Text>
                <small className="text-muted">Author: {post.author._id}</small>
              </Card.Text>
              <div>
                <Link to={`/viewBlog/${post._id}`}>
                  <Button variant="primary" className="mr-2">
                    View Post
                  </Button>
                </Link>
                {(user.isAdmin || user.id === post.author._id) && (
                  <Link to={`/editPost/${post._id}`}>
                    <Button variant="warning" className="mr-2">
                      Edit Post
                    </Button>
                  </Link>
                )}
                {user.isAdmin && (
                  <Button
                    variant="danger"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    Delete Post
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogPostsList;
