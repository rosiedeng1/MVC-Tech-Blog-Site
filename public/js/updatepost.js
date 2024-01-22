const newFormHandler = async (event) => {
    event.preventDefault();
  
    const title = document.querySelector('#blog-title').value.trim();
    const content = document.querySelector('#content').value.trim();
    console.log(title, content )

    // Update post 
    if (title && content) {
        console.log('posting')
      const response = await fetch(`/api/post`, {
        method: 'PUT',
        body: JSON.stringify({title, content}),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(await response.json());
      console.log(title, content )

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert('Failed to create blog post');
      }
    }
  };

  document
  .querySelector('.updated-post-form')
  .addEventListener('submit', newFormHandler);
  console.log('check')