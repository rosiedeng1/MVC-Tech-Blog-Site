// Imports and initializes express router 
const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

// Post route for creating a new post 
router.post('/', async (req, res) => {
  try {
    console.log("rosie session: " + JSON.stringify(req.session))
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    
    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});


router.get('/', (req, res) => {
  // Finds all the posts and includes its associated Posts 
  Post.findAll( {
    include: [Post]
  }).then((postData) => {
    res.json(postData);
  });
});

// Finds one category by its 'id' value and includes its associated Products 
router.get('/:id', (req, res) => {
  Post.findOne(
    {
      // Gets the category based on the id given in the request parameters
      where: { 
        id: req.params.id 
      },
    }
    ).then((postData) => {
      res.json(postData);
    });
  });
  
  
  router.put('/:id', (req, res) => {
    // update a category by its `id` value
    Post.update(
      {
        // All the fields you can update and the data attached to the request body.
        content: req.body.content,
        id: req.body.id,
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
    
    
    router.delete('/:id', withAuth, async (req, res) => {
      console.log('rosiedelete')
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
    
    module.exports = router;