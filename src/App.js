import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';
import AppNavbar from './components/AppNavBar';
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Logout from './pages/Logout'
import BlogPostsList from './pages/BlogPostList';
import ViewBlog from './pages/ViewBlog'
import EditPost from './pages/EditPost';
import CreateBlog from './pages/CreateBlog';

import './App.css';
import { Container } from 'react-bootstrap';


function App() {

  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });


  useEffect(() => {

    fetch('https://blogpostapi-3mjz.onrender.com/users/details', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)

        if (typeof data.user !== "undefined") {

          setUser({
            id: data.user._id,
            isAdmin: data.user.isAdmin
          });

        } else {

          setUser({
            id: null,
            isAdmin: null
          });

        }

      })

  }, []);


  const unsetUser = () => {

    localStorage.clear()

  };


  return (

    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/blogPostList' element={<BlogPostsList isAdmin={user.isAdmin} />} />
            <Route path='/viewBlog/:postId' element={<ViewBlog user={user} />} />
            <Route path='/editPost/:postId' element={<EditPost />} />
            <Route path='/createBlog' element={<CreateBlog />} />

          </Routes>
        </Container>
      </Router>
    </UserProvider>

  );
}

export default App;
