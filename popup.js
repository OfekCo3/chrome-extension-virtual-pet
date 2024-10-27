// const petImage = document.getElementById('pet');
const feedButton = document.getElementById('feed-button');
const changePetButton = document.getElementById('change-pet-button');
const foodOptions = document.getElementById('food-options');
const foodItems = document.getElementsByClassName('food-item');
const speechBubble = document.getElementById('speech-bubble');
const petImage = document.getElementById('pet');
const petSelection = document.getElementById('pet-selection');
const petButtons = document.getElementsByClassName('pet-button');

// const pets = ['cat', 'dog', 'hamster', 'turtle', 'parrot', 'fish'];
const pets = ['cat', 'dog', 'hamster', 'parrot', 'fish'];
let currentPetIndex = 0;

foodOptions.style.display = "none";
petSelection.style.display = "none";
speechBubble.innerText = 'Mouse hover to pet!';  


// Show or hide food options when the "Feed" button is clicked
feedButton.addEventListener('click', () => {
    speechBubble.innerText = 'Please not broccoli!';
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
    const foodItem = foodItems[i];

    foodItem.addEventListener('click', () => {
        if (foodItem.id === 'Broccoli') {
            speechBubble.innerText = 'Ew!';
        } else {
            speechBubble.innerText = 'Tasty!';
        }

        foodOptions.style.display = "none";
        feedButton.style.display = "block";
        changePetButton.style.display = "block";

        setTimeout(() => {
            speechBubble.innerText = 'Mouse hover to pet!';
        }, 1500);
    });
}

// Toggle pet selection menu when "Change Pet" button is clicked
changePetButton.addEventListener('click', () => {
    feedButton.style.display = "none";
    changePetButton.style.display = "none";
    petSelection.style.display = petSelection.style.display === "none" ? "flex" : "none";
});

// Add event listeners for each pet button
for (let i = 0; i < petButtons.length; i++) {
    petButtons[i].addEventListener('click', (event) => {
        const selectedPet = event.target.getAttribute('data-pet');
        petImage.src = `images/pets/${selectedPet}.png`;
        speechBubble.innerText = `Meet your new pet, ${selectedPet}!`;

        // Hide the pet selection menu and display back feed and change pet buttons
        petSelection.style.display = "none";
        feedButton.style.display = "block";
        changePetButton.style.display = "block";

        setTimeout(() => {
            speechBubble.innerText = 'Mouse hover to pet!';
        }, 1500);
    });
}