// Create an array to hold the paths to the image files
const images = [
  'images/img1.jpg', // Image 1
  'images/img2.jpg', // Image 2
  'images/img3.jpg', // Image 3
  'images/img4.jpg'  // Image 4
];

// Start with the first image (index 0)
let currentIndex = 0;

// Function to update the image being displayed
function showImage(index) {
  const img = document.getElementById('slide'); // Get the image element by its ID
  img.src = images[index]; // Set the image source to the selected index
}

// Function to go to the next image
function nextImage() {
  currentIndex = (currentIndex + 1) % images.length; // Increase index and wrap around using modulo
  showImage(currentIndex); // Show the new image
}

// Function to go to the previous image
function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length; // Decrease index and wrap around
  showImage(currentIndex); // Show the new image
}

