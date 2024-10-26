// const petImage = document.getElementById('pet');
const feedButton = document.getElementById('feed-button');
const changePetButton = document.getElementById('change-pet-button');
const foodOptions = document.getElementById('food-options');
const foodItems = document.getElementsByClassName('food-item');
const speechBubble = document.getElementById('speech-bubble');

foodOptions.style.display = "none";
speechBubble.innerText = 'Mouse hover to pet!';  


// Show or hide food options when the "Feed" button is clicked
feedButton.addEventListener('click', () => {
    if (foodOptions.style.display === "none") {
        foodOptions.style.display = "block";
        feedButton.style.display = "none";
        changePetButton.style.display = "none";

    } else {
        foodOptions.style.display = "none";
        feedButton.style.display = "block";
        changePetButton.style.display = "block";

    }
});

// Add click event listeners to each food item
for (let i = 0; i < foodItems.length; i++) {
    foodItems[i].addEventListener('click', () => {
    speechBubble.innerText = 'Tasty!';
    foodOptions.style.display = "none";
    feedButton.style.display = "block";
    changePetButton.style.display = "block";

    setTimeout(() => {
        speechBubble.innerText = 'Mouse hover to pet!';  
    }, 1500);

    });
}
