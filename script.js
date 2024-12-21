if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../sw.js').then(() => {
      console.log('Service Worker Registered');
    }).catch(error => {
      console.error('Service Worker registration failed:', error);
    });
  });
}

const carousel = document.getElementById('carousel');
    const details = document.getElementById('details');

    let currentIndex = 0;
    const batchSize = 10; // Number of objects to fetch each time

    // List of object IDs for fetching images
    const objectIds = [
      435882, 436535, 436121, 435809, 435849, 436524, 435890, 436011, 435811, 436155,
      436524, 436117, 435837, 436489, 436287, 436104, 436236, 435921, 435955, 436004,
      435885, 435821, 436532, 436120, 436253, 435882, 435931, 436322, 436091, 436015
    ];

    // Function to fetch and display images
    function loadImages() {
      // Limit objectIds to the batch size based on currentIndex
      const batchIds = objectIds.slice(currentIndex, currentIndex + batchSize);
      currentIndex += batchSize;

      batchIds.forEach(id => {
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
          .then(response => response.json())
          .then(data => {
            const { title, primaryImageSmall } = data;

            // Create carousel item
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.innerHTML = `
              <img src="${primaryImageSmall || 'https://via.placeholder.com/150'}" alt="${title || 'Untitled'}">
              <p>${title || 'Untitled'}</p>
            `;
            item.addEventListener('click', () => showDetails(data));
            carousel.appendChild(item);
          })
          .catch(error => console.error('Error fetching object:', error));
      });
    }

    // Function to display details of the selected image
    function showDetails(data) {
      const { title, artistDisplayName, objectDate, primaryImage, objectID } = data;

      details.innerHTML = `
        <h2>${title || 'Untitled'}</h2>
        <p><strong>Artist:</strong> ${artistDisplayName || 'Unknown'}</p>
        <p><strong>Date:</strong> ${objectDate || 'Unknown'}</p>
        ${primaryImage ? `<img src="${primaryImage}" alt="${title || 'Untitled'}" style="max-width: 100%; margin-top: 10px;">` : ''}
        <p><strong>Object ID:</strong> ${objectID}</p>
      `;
    }

    // Function to handle the scroll event
    function onScroll() {
      if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10) {
        loadImages(); // Load more images when the user scrolls to the end
      }
    }

    // Initialize the carousel with the first batch of images
    loadImages();

    // Add the scroll event listener
    carousel.addEventListener('scroll', onScroll);
