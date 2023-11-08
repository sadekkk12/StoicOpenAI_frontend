document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('submitBtn').addEventListener('click', function(event) {
        event.preventDefault(); // This will prevent the default form submit action
        var aboutText = document.getElementById('question').value;
        fetch(`http://localhost:8080/?about=${encodeURIComponent(aboutText)}`, { // Use the root endpoint for GET requests
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const quotesRaw = data.answer;
            const quotesArray = quotesRaw.split('\n\n');
            const formattedQuotes = quotesArray.map((quote, index) => `${index + 1}. ${quote.trim()}`).join('<br><br>');
            document.getElementById('response').innerHTML = formattedQuotes;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('response').innerText = 'An error occurred while fetching the answer.';
        });
    });
});
