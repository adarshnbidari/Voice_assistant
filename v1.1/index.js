var demo = document.getElementById('demo');

var recognition = undefined;

var listening = false;

window.addEventListener("load", e => {

    qna.load()
        .then(() => {
            console.log('model loaded');
        })

});

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
            AssistantReply(userInput);
            // if (botReply == 'redirect') {
            //     let msg = new SpeechSynthesisUtterance('I have found results for you');
            //     synth.speak(msg);
            //     window.location = `https://www.google.com/search?q=${userInput}`;
            //     return;
            // }

            // if (!said) {
            //     let msg = new SpeechSynthesisUtterance(botReply);
            //     synth.speak(msg);
            // }

        }
    };


    recognition.onnomatch = e => {
        recognition.stop();
        demo.innerHTML = "Sorry, i didn't recognize it";

        // let msg = new SpeechSynthesisUtterance('I have found results for you');
        // synth.speak(msg);

        // window.location = `https://www.google.com/search?q=${userInput}`;

    };

    recognition.onerror = e => {
        recognition.stop();
        alert('Current we are having a trouble!... Please try again later');
        console.log(e);
    };

}



function AssistantReply(userIntake) {

    var passage = "GMIT  established in the \
    academic year 2001-02 by Srishyla Educational Trust (R), Bheemasamudra with the vision to \
    provide quality technical and management education to the rural students. The Founder President\
     of the Trust was Late Sri. G. Mallikarjunappa the then Honorable Member of Parliament, Davangere.\
     The goals are To create a comprehensive Technical platform for students to develop inter personnel \
     skills, creativity and incisive edge of professionalism. To collaborate with organizations in the \
     industry for mutual exchange of skills, technology and global vision.\
     ";

    var count = 0;

    function storeTime() {
        count++;
    }

    setInterval(storeTime, 1000);

    try {

        if (userIntake != undefined) {

            qna.load()
                .then(model => {

                    model.findAnswers(userIntake, passage)
                        .then(answers => {
                            clearInterval(storeTime);
                            console.log(`Time taken: ${count}`);
                            console.log(answers);

                            if (answers.length > 0) {

                                var replyFromBot = new SpeechSynthesisUtterance(answers[0].text);
                                synth.speak(replyFromBot);
                            }



                        });

                });

        }


    } catch{

    }

    // return result;

    // switch (userIntake) {
    //     case 'how are you':
    //         return 'iam fine';
    //         break;
    //     case 'hi':
    //         return 'hi';
    //     case 'can we talk':
    //         return 'sure';
    //         break;
    //     case 'who created you':
    //         return 'adarsh created me';
    //         break;
    //     case 'tell me a joke':
    //         return 'you are beautiful';
    //         break;
    //     case 'date':
    //         return "It's " + new Date().getDate();
    //         break;
    //     case 'this month':
    //         return "It's " + new Date().getMonth();
    //         break;
    //     case 'this year':
    //         return "It's " + new Date().getFullYear();
    //         break;
    //     case 'bye bye':
    //         return 'bye bye i miss you';
    //         break;
    //     case 'what are you doing':
    //         return 'iam just conversing with an intelligent person';
    //         break;
    //     default:
    //         return 'sorry i dont know';
    // }


}

