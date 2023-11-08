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
            document.getElementById('response').innerText = JSON.stringify(data); // Assuming the response is the full MyResponse object
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('response').innerText = 'An error occurred while fetching the answer.';
        });
    });
});
