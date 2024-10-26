const petImage = document.getElementById('pet');
const feedButton = document.getElementById('feed-button');
const foodOptions = document.getElementById('food-options');

// // Hover alert for petting
// petImage.addEventListener('mouseover', () => {
//   alert('Purr');
// });

// Show or hide food options when the "Feed" button is clicked
feedButton.addEventListener('click', () => {
    if (foodOptions.style.display === "none") {
        foodOptions.style.display = "block";
    } else {
        foodOptions.style.display = "none";
    }
});
