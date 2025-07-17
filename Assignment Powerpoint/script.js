const images = [
  'images/img1.jpg',
  'images/img2.jpg',
  'images/img3.jpg',
  'images/img4.jpg'
];

let currentIndex = 0;

function showImage(index) {
  const img = document.getElementById('slide');
  img.src = images[index];
}

function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
}

function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
}

 setInterval(nextImage, 3000);
