document.addEventListener('DOMContentLoaded', function() {
    var isSelectingQuote = false; // state flag to track what the input field is being used for
    var quotesArray = []; // to store quotes between interactions

    document.getElementById('submitBtn').addEventListener('click', function(event) {
        event.preventDefault();

        // if selecting a quote, send the selected number to get an explanation
        if (isSelectingQuote) {
            var selection = document.getElementById('question').value.trim();
            var selectionNumber = parseInt(selection, 10);

            // Make sure the user entered a valid number
            if (selectionNumber >= 1 && selectionNumber <= 5) {
                fetchExplanation(quotesArray[selectionNumber - 1]);
                generateAndDisplayImage(quotesArray[selectionNumber - 1]);
            } else {
                document.getElementById('response').innerText = 'Please enter a valid number (1-5).';
            }
        } else {
            // if not selecting a quote, get the quotes
            var aboutText = document.getElementById('question').value;
            fetch(`http://localhost:8080/quotes?userInput=${encodeURIComponent(aboutText)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                quotesArray = data.answer.split('\n\n');
                const formattedQuotes = quotesArray.map((quote, index) => `${index + 1}. ${quote.trim()}`).join('<br><br>');
                document.getElementById('response').innerHTML = formattedQuotes;
                
                // After displaying the quotes, ask for a number
                document.getElementById('response').innerHTML += '<br><br>Enter the number of the quote you want explained in the box above and press Submit.';
                
                // Now switch to selecting a quote
                isSelectingQuote = true;
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('response').innerText = 'An error occurred while fetching the quotes.';
            });
        }
    });
});

function fetchExplanation(quote) {
    // Implement the fetch call to your backend with the selected quote
    //insert correct endpoint
    fetch(`http://localhost:8080/explanation?quote=${encodeURIComponent(quote)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('response').innerHTML = data.answer;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('response').innerText = 'An error occurred while fetching the explanation.';
    });
}
function generateAndDisplayImage(quote) {
    fetch(`http://localhost:8080/generate-image`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quote: quote })
    })
    .then(handleResponse)
    .then(data => {
        const imageElement = document.createElement('img');
        imageElement.src = data.answer;
        document.getElementById('imageResponse').appendChild(imageElement);
    })
    .catch(handleError);
}

function handleResponse(response) {
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }
    return response.json();
}

function handleError(error) {
    console.error('Error:', error);
    document.getElementById('response').innerText = 'An error occurred while processing your request.';
}
