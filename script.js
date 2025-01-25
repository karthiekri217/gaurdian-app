// Function to start listening for voice commands
function startListening() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = function (event) {
            const command = event.results[0][0].transcript.toLowerCase();
            console.log("Command received: " + command);

            if (command.includes("object")) {
                window.location.href = "object.html"; // Redirect to object.html
            } else if (command.includes("message")) {
                window.location.href = "user.html"; // Redirect to user.html
            }else if (command.includes("navigation")) {
                window.location.href = "map.html"; // Redirect to user.html
            }
             else {
                alert("Command not recognized. Please say 'Object Detection' or 'send messeage'.");
            }
        };

        recognition.onerror = function (event) {
            alert("Error occurred: " + event.error);
        };

        recognition.start();
    } else {
        alert("Speech recognition is not supported in this browser.");
    }
}
