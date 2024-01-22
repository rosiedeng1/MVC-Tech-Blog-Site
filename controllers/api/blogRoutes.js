// Imports and initializes express router 
const router = require('express').Router();
const { Post, User } = require('../../models');
const withAuth = require('../../utils/auth');

// Post route for creating a new post 
router.post('/', async (req, res) => {
  try {
    console.log("session: " + JSON.stringify(req.session))
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    
    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  console.log('delete')
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    
    if (!postData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }
    
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/', (req, res) => {
  // Finds all the posts and includes its associated Posts 
  Post.findAll( {
    // include: [Post]
  }).then((postData) => {
    res.json(postData);
  });
});

// Finds one post by its 'id' value and includes its associated Products 
// router.get('/:id', (req, res) => {
//   Post.findOne(
//     {
//       // Gets the post based on the id given in the request parameters
//       where: { 
//         id: req.params.id 
//       },
//     }
//     ).then((postData) => {
//       res.json(postData);
//     });

//     // TODO: generate frontend using the handlebars
//   });

      // Updates the blog post using a get route (generates the html)
  router.get('/:id', async (req, res) => {
    try {
      const postData = await Post.findByPk(req.params.id, {
        // include: [
        //   {
        //     model: User,
        //     attributes: ['name'],
        //   },
        // ],
      });
  
      const post = postData.get({ plain: true });
      console.log("Post: " + JSON.stringify(post))
      res.render('update', {
        ...post,
        logged_in: req.session.logged_in
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

// Route for updating a blog post 
router.put('/:id', (req, res) => {
  // update a post by its `id` value
  Post.update(
    {
      // All the fields you can update and the data attached to the request body.
      title: req.body.title,
      content: req.body.content,
      // id: req.body.id,
    },
    {
      // Gets the tag based on the id given in the request parameters
      where: {
        id: req.params.id,
      },
    }
    )
    .then((updatedPost) => {
      // Sends the updated tag as a json response
      res.json(updatedPost);
    })
    .catch((err) => res.json(err));
  });


module.exports = router;