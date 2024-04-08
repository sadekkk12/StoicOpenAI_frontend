document.addEventListener('DOMContentLoaded', function() {
    var isSelectingQuote = false;
    var quotesArray = [];
    document.getElementById('question').value = '';


    document.getElementById('submitBtn').addEventListener('click', function(event) {
        event.preventDefault();

        if (isSelectingQuote) {
            var selection = document.getElementById('question').value.trim();
            var selectionNumber = parseInt(selection, 10);

            if (selectionNumber >= 1 && selectionNumber <= 5) {
                document.getElementById('question').value = '';
                document.getElementById('response').innerHTML = getSpinnerWithMessage('An explanation is being generated, please wait..');


                Promise.all([
                    fetchExplanation(quotesArray[selectionNumber - 1]).then(response => response.json()),
                    generateAndDisplayImage(quotesArray[selectionNumber - 1])
                ])
                .then(([explanationData]) => {
                    // Explanation and image are both ready, update DOM to display them.
                    document.getElementById('response').innerHTML = explanationData.answer;
                    // The image has already been added to the DOM by generateAndDisplayImage.
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('response').innerText = 'An error occurred.';
                });
            } else {
                document.getElementById('response').innerText = 'Please enter a valid number (1-5).';
            }
        } else {
            var aboutText = document.getElementById('question').value; // Capture the value
        document.getElementById('question').value = ''; // Clear the textbox immediately
            document.getElementById('response').innerHTML = getSpinnerWithMessage('Five quotes are being generated, please wait..');
            fetch(`https://stoicopenaibackend.azurewebsites.net/quotes?userInput=${encodeURIComponent(aboutText)}`, {
            
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                quotesArray = data.answer.split('\n\n');
                const formattedQuotes = quotesArray.map((quote, index) => `${index + 1}. ${quote.trim()}`).join('<br><br>');
                document.getElementById('response').innerHTML = formattedQuotes;
                document.getElementById('response').innerHTML += '<br><br>Enter the number of the quote you want explained in the box above and press Submit.';
                isSelectingQuote = true;
            })
            .then(data =>{
                resetAfterExplanation();
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('response').innerText = 'An error occurred while fetching the quotes.';
            });
        }
    });
});

function fetchExplanation(quote) {
    return fetch(`https://stoicopenaibackend.azurewebsites.net/explanation?quote=${encodeURIComponent(quote)}`, {
    
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

function generateAndDisplayImage(quote) {
    return fetch(`https://stoicopenaibackend.azurewebsites.net/generate-image`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quote: quote })
    })
    .then(response => response.json())
    .then(data => {
        return new Promise((resolve, reject) => { // Ensure the promise handles both resolve and reject scenarios
            const imageElement = document.createElement('img');
            imageElement.onload = resolve; // Resolve when the image has finished loading
            imageElement.onerror = reject; // Reject the promise if there's an error loading the image
            imageElement.src = data.answer;
            document.getElementById('imageResponse').innerHTML = ''; // Clear previous images
            document.getElementById('imageResponse').appendChild(imageElement);
        });
    });
}


function resetButton() {
    isSelectingQuote = false;
    quotesArray = [];
    document.getElementById('question').value = '';
    document.getElementById('response').innerHTML = 'You have now reset the process! Send in a new request!';
}

function resetAfterExplanation() {
    isSelectingQuote = false;
    quotesArray = [];
    document.getElementById('question').value = '';
}


document.getElementById('startButton').addEventListener('click', function() {
    var form = document.getElementById('questionForm');

    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block'; // Show the form

        // Calculate the new scroll position
        var scrollPosition = form.offsetTop + 100; // Additional 100 pixels down

        // Scroll to the new position
        window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        });

        document.getElementById('question').focus();
    } else {
        form.style.display = 'none'; // Hide the form
    }
});

function getSpinnerWithMessage(message) {
    return `
        <div class="mx-auto p-3 d-flex align-items-center">
            <p class="mb-0" style="display: inline-block;">${message}</p>
            <div class="spinner-grow text-secondary ml-2" role="status" style="width: 1.5rem; height: 1.5rem;">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    `;
}
