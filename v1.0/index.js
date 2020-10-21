var demo = document.getElementById('demo');

var recognition = undefined;

var listening = false;

window.addEventListener('click', e => {
    if (!listening) {
        recognition.start();
        listening = true;
    }

});


if ('speechSynthesis' in window) {

    var synth = window.speechSynthesis;

}



if ('webkitSpeechRecognition' in window) {

    recognition = new webkitSpeechRecognition();

    recognition.continous = true;

    recognition.lang = "en-US";

    recognition.interimResults = true;

    recognition.maxAlternatives = 1;

    var said = false;

    var userInput = undefined;

    recognition.onresult = e => {
        if (listening) {

            let res = e.results[0][0].transcript;

            demo.innerHTML = res;

            userInput = res;

        }
    };

    recognition.onsoundend = e => {
        if (listening) {
            listening = false;
            recognition.stop();
        }
    };


    recognition.onspeechend = e => {
        if (listening) {
            recognition.stop();
            let botReply = AssistantReply(userInput);
            if(botReply=='redirect'){
                let msg = new SpeechSynthesisUtterance('I have found results for you');
                synth.speak(msg);
                window.location=`https://www.google.com/search?q=${userInput}`;
                return;
            }

            if (!said) {
                let msg = new SpeechSynthesisUtterance(botReply);
                synth.speak(msg);
            }

        }
    };


    recognition.onnomatch = e => {
        recognition.stop();
        demo.innerHTML = "Sorry, i didn't recognize it";
    };

    recognition.onerror = e => {
        recognition.stop();
        alert('Current we are having a trouble!... Please try again later');
        console.log(e);
    };

}



function AssistantReply(userIntake) {

    switch (userIntake) {
        case 'how are you':
            return 'iam fine';
            break;
        case 'hi':
            return 'hi';
        case 'can we talk':
            return 'sure';
            break;
        case 'who created you':
            return 'adarsh created me';
            break;
        case 'tell me a joke':
            return 'you are beautiful';
            break;
        case 'date':
            return "It's "+new Date().getDate();
            break;
        case 'this month':
            return "It's "+new Date().getMonth();
            break;
        case 'this year':
            return "It's "+new Date().getFullYear();
            break;
        case 'bye bye':
            return 'bye bye i miss you';
            break;
        case 'what are you doing':
            return 'iam just conversing with an intelligent person';
            break;
        default:
            return 'sorry i dont know';
    }

}

