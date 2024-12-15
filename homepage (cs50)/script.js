let contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the default form submission

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  // Simulate form submission (you can replace this with actual API call)
  setTimeout(() => {
      document.getElementById('responseMessage').innerText = `Thank you, ${name}! Your message has been sent.`;
      document.getElementById('contactForm').reset(); // Reset the form
  }, 1000);
});

let button = document.getElementById("backToHome");

button.addEventListener("click", () => {
  window.location.href = "index.html"; // Redirect to home page
});
