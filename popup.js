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

foodOptions.style.display = "none";
petSelection.style.display = "none";
speechBubble.innerText = 'Mouse hover to pet!';  

// Function to display/undisplay the menu buttons
function displayMenuButtons(display) {
    feedButton.style.display = display;
    changePetButton.style.display = display;

}
// Function to set the speechBubble to regular text
function setRegularSpeechBubbleText() {
    setTimeout(() => {
        speechBubble.innerText = 'Mouse hover to pet!';
    }, 1500);
}

// Function to save the selected pet in Chrome storage
function savePetPreference(pet) {
    chrome.storage.sync.set({ selectedPet: pet }, () => {
        console.log(`Pet preference saved: ${pet}`);
    });
}

// Function to load the saved pet preference from Chrome storage
function loadPetPreference() {
    chrome.storage.sync.get("selectedPet", (result) => {
        const savedPet = result.selectedPet || "cat"; // Default to "cat" if nothing is saved
        petImage.src = `images/pets/${savedPet}.png`;
        speechBubble.innerText = `Welcome back!`;
        setRegularSpeechBubbleText();
    });
}

// Load the pet preference when the extension opens
document.addEventListener("DOMContentLoaded", loadPetPreference);

// Show or hide food options when the "Feed" button is clicked
feedButton.addEventListener('click', () => {
    speechBubble.innerText = 'Please not broccoli!';
    if (foodOptions.style.display === "none") {
        displayMenuButtons("none");
        foodOptions.style.display = "block";

    } else {
        foodOptions.style.display = "none";
        displayMenuButtons("block");
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
        displayMenuButtons("block");
        setRegularSpeechBubbleText();
    });
}

// Toggle pet selection menu when "Change Pet" button is clicked
changePetButton.addEventListener('click', () => {
    displayMenuButtons("none");
    petSelection.style.display = petSelection.style.display === "none" ? "flex" : "none";
});

// Add event listeners for each pet button
for (let i = 0; i < petButtons.length; i++) {
    petButtons[i].addEventListener('click', (event) => {
        const selectedPet = event.target.getAttribute('data-pet');
        petImage.src = `images/pets/${selectedPet}.png`;
        speechBubble.innerText = `Meet your new pet, ${selectedPet}!`;

        // Remove the fish class from all pets
        petImage.classList.remove('fish');
        // If the selected pet is fish, add the fish class
        if (selectedPet === 'fish') {
            petImage.classList.add('fish');
        }
        
        // Save the selected pet preference
        savePetPreference(selectedPet);

        // Hide the pet selection menu and display back feed and change pet buttons
        petSelection.style.display = "none";
        displayMenuButtons("block");
        setRegularSpeechBubbleText();
    });
}