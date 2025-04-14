// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup.jsx';
import Signin from './pages/Signin.jsx';
import Home from './pages/Home.jsx';
import BlogDetails from './pages/BlogDetails .jsx';
import CreateBlog from './pages/CreateBlog.jsx';
import UserBlogs from './components/UserBlogs.jsx';
import EditBlog from './pages/Editblog.jsx';
import ExploreUnderConstruction from './components/Explorepage.jsx';
import Categories from './components/Categories.jsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/Home' element={<Home/>}></Route>
        <Route path='/' element={<Signup />}></Route>
        <Route path='/Signin' element={<Signin />}></Route>
        <Route path='/blogs/:id' element={<BlogDetails/>}></Route>
        <Route path='/CreateBlog' element={<CreateBlog/>}></Route>
        <Route path='/myblogs' element={<UserBlogs/>}></Route>
        <Route path='/edit-blog/:id' element={<EditBlog/>}></Route>
        <Route path='/explore' element={<ExploreUnderConstruction/>}></Route>
        <Route path='/categories' element={<Categories/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;