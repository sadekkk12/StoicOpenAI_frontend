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
                document.getElementById('response').innerHTML = 'An explanation is being generated for the chosen quote, please wait..';


                fetchExplanation(quotesArray[selectionNumber - 1])
                .then(response => response.json())
                .then(data => {
                    const explanation = data.answer;

                    document.getElementById('response').innerHTML = '';
                    document.getElementById('imageResponse').innerHTML = '';
                    const responseDiv =document.getElementById('response');
                    responseDiv.style.textAlign = 'left';

                    // Apply typewriter effect and then display the image
                    typeWriterEffect(explanation, 'response', 50, () => {
                        generateAndDisplayImage(quotesArray[selectionNumber - 1]);
                    });
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
            document.getElementById('response').innerHTML = 'Five quotes related to your input are being generated based on your answer!';
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
        const imageElement = document.createElement('img');
        imageElement.src = data.answer;
        document.getElementById('imageResponse').appendChild(imageElement);
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('response').innerText = 'An error occurred while processing your request.';
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

function typeWriterEffect(text, elementId, speed, callback) {
    let i = 0;
    const elem = document.getElementById(elementId);

    function typing() {
        if (i < text.length) {
            elem.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        } else {
            if (callback) callback();
        }
    }

    typing();
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
