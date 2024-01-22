const router = require('express').Router();
const { User, Post } = require('../models');
// Import the custom middleware
const withAuth = require('../utils/auth');

// Prevent non logged in users from viewing the homepage
router.get('/', withAuth, async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['username', 'ASC']],
    });
    
    const posts = userData.map((project) => project.get({ plain: true }));
    
    res.render('homepage', {
      posts,
      // Pass the logged in flag to the template
      logged_in: req.session.logged_in,
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

module.exports = router;


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