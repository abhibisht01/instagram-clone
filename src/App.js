
import { useState, useEffect } from 'react';
import './App.css';
import db, { auth } from './firebase';
import Post from './Post';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Input } from '@mui/material';
import ImageUpload from './ImageUpload';


// import { InstagramEmbed } from 'react-social-media-embed';

import SearchIcon from '@mui/icons-material/Search';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [openSignIn, setOpenSignIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out...
        setUser(null);
      }
    });

    return () => {

      //performs the cleanup functions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data(),
      })))
    })

  }, [])

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <form className="app__signup">
            <center>
              <img
                className="modal__headerImage"
                src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="signup_input"
            />
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="signup_input"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signup_input"
            />



            <Button type="submit" onClick={signUp} variant="contained" color="secondary">
              Sign Up
            </Button>

            <div className="signInLabel">
              <img
                className="modal__headerImage"
                src="https://i.pinimg.com/originals/8a/77/05/8a770507298d728a1e3e039a0507dd8e.png"
                alt=""
              //   className = "signInLabelImg"
              />
              <p className="signInLabelText">Sed ut perspiciatis unde omnis iste natus error sit voluptatem Sed ut perspiciatis unde omnis iste natus error ut perspiciatis unde omnis iste natus error </p>
            </div>
          </form>
        </Box>

      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <Box sx={style}>
          <form className="app__signup">
            <center>
              <img
                className="modal__headerImage"
                src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
                alt="instagram"
              />
            </center>

            <Input
              type="text"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="signup_input"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signup_input"
            />

            <Button type="submit" onClick={signIn} variant="contained" color="secondary">
              Sign In
            </Button>

            <div className="signInLabel">
              <img
                className="modal__headerImage"
                src="https://i.pinimg.com/originals/8a/77/05/8a770507298d728a1e3e039a0507dd8e.png"
                alt="instagram"
              //   className = "signInLabelImg"
              />
              <p className="signInLabelText">Sed ut perspiciatis unde omnis iste natus error sit voluptatem Sed ut perspiciatis unde omnis iste natus error ut perspiciatis unde omnis iste natus error </p>
            </div>


          </form>
        </Box>

      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
          alt="instagram"
        />

        <div className="searchForm">
          <form>
            <SearchIcon className="searchIcon" fontSize="small" />
            <input type="text" id="filter" placeholder="Search" className="searchBarInput" />
          </form>
        </div>

        <div className="header_icons">
          <HomeRoundedIcon fontSize="large" className="header_icon" />
          <NearMeOutlinedIcon fontSize="large" className="header_icon" />
          <ExploreOutlinedIcon fontSize="large" className="header_icon" />
          <FavoriteBorderIcon fontSize="large" className="header_icon" />
        </div>

        <div className="signupButton" >
          {user ? (
            <Button onClick={() => auth.signOut()}
              variant="contained" color="secondary" className="signOutButton">Logout</Button>
          ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpenSignIn(true)} className="signInButton">Sign In</Button>
              <Button onClick={() => setOpen(true)} variant="contained" color="secondary">Sign Up</Button>
            </div>
          )}
        </div>

      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <div className="upload_message" >
          <h3>Login to Create a Post 🚀 !!!</h3>
          <p><b>Welcome to Instagram Clone App!</b> To Create a new Post, the User has to sign up for the application first using any mail ID (Works with an Invalid Mail ID too). For example : "xyz@gmail.com". User can Sign-In using the same credentials again and again. <br /><br />
            <b>For Creating a Post</b> you need to sign-in first. Then click the "UPLOAD PHOTO" Button. Select a Photo from your device, add a suitable caption to the Post, and then click "CREATE POST" Button. Wait till the photo gets uploaded. And then BOOM!!! Your Post has been created(Scroll a bit if you don't find your post at the top).
            <br /><br />
            <b>Hope you have a Great time exploring the Application 💖 !!!</b>
          </p>
          <Button onClick={() => setOpenSignIn(true)} className="upload_signInButton" color="secondary" variant="contained" >Sign In</Button>

        </div>

      )}


      {posts.map(({ id, post }) => (
        <Post
          key={id}
          postId={id}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
          avatar={post.avatar}
          user={user}
        />
      ))}


    </div>
  );
}

export default App;