const router = require('express').Router();
const { User, Post } = require('../models');
// Import the custom middleware
const withAuth = require('../utils/auth');


//Get all the existing blog posts to show on homepage 
router.get('/', async (req, res) => {
  try {
    // Finds every single post in the post table 
    const postData = await Post.findAll({
      attributes: { exclude: ['password'] },
      include: [{ model: User}],
    });
    
    const posts = postData.map((post) => post.get({ plain: true }));
    console.log('posts' + JSON.stringify(posts))

    res.render('homepage', {
      posts,
      // Pass the logged in flag to the template
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const projectData = await Project.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const projects = projectData.map((project) => project.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      projects, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/login', (req, res) => {
  // If a session exists, redirect the request to the homepage
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  
  res.render('login');
});

// Renders the dashboard 
router.get('/dashboard', withAuth, async (req, res) => {

  // Get the user first using the user's id and then getting all the Posts associated with the User's id
  const userData = await User.findByPk(req.session.user_id, {
    attributes: { exclude: ['password'] },
    include: [{ model: Post}],
  });
  
  const user = userData.get({ plain: true });

  console.log("rosiedeng user: " + JSON.stringify(user))
  
  // Renders dashboard.handlebars
  res.render('dashboard',   { ...user,
    logged_in: true });
  });
  
  
  
  module.exports = router;