 const form = document.getElementById('login-form');
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const validCredentials = [
      { username: 'user1', password: 'pass1' },
      { username: 'user2', password: 'pass2' }
    ];

    for (const credential of validCredentials) {
      if (credential.username === username.value && credential.password === password.value) {
        window.location.href = '/home';
      } else {
        alert('Invalid username or password');
      }
    }
  });