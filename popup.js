const petImage = document.getElementById('pet');
const feedButton = document.getElementById('feed-button');
const foodOptions = document.getElementById('food-options');
const foodItems = document.getElementsByClassName('food-item');

// Ensure foodOptions is hidden by default
foodOptions.style.display = "none";

// Show or hide food options when the "Feed" button is clicked
feedButton.addEventListener('click', () => {
    if (foodOptions.style.display === "none") {
        foodOptions.style.display = "block";
        feedButton.style.display = "none";
    } else {
        foodOptions.style.display = "none";
        feedButton.style.display = "block";
    }
});

// Add click event listeners to each food item
for (let i = 0; i < foodItems.length; i++) {
    foodItems[i].addEventListener('click', () => {
        alert('Tasty!');
        foodOptions.style.display = "none";
        feedButton.style.display = "block";
    });
}
