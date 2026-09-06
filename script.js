// ========================================
// TYPING TEST
// ========================================

// Text used for the typing test
const paragraphs = [
    `Learning how to type quickly and accurately is a useful skill for students,
    programmers, writers, office workers, and anyone who spends a lot of time
    using a computer. The best way to improve is to practice regularly without
    focusing too much on speed. Start by making sure that each word is typed
    correctly, then gradually increase your speed as your accuracy improves.
    Over time, your fingers will become more familiar with the keyboard and
    typing will begin to feel more natural.`,

    `Programming is a creative way to solve problems using computers. A program
    can start as a simple idea and gradually become a complete application.
    Developers often break complicated problems into smaller tasks that are
    easier to understand and solve. Writing code requires patience because
    errors are a normal part of the development process. When a program does
    not work as expected, programmers investigate the problem, test different
    solutions, and continue improving their code until they achieve the desired
    result.`,

    `The world is full of interesting places, people, and cultures. Traveling
    gives us an opportunity to experience things that may be very different
    from our everyday lives. Visiting another city or country can teach us
    about local traditions, history, food, language, and architecture. Even
    when traveling is not possible, reading about different places can help
    us understand how people around the world live and think. Curiosity about
    other cultures can make us more open-minded and appreciative of differences.`
];


// ========================================
// ELEMENTS
// ========================================

const textDisplay = document.getElementById("textDisplay");
const typingInput = document.getElementById("typingInput");
const typingCard = document.querySelector(".typing-card");

const timeDisplay = document.getElementById("time");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const bestDisplay = document.getElementById("best");

const correctWordsDisplay = document.getElementById("correctWords");
const incorrectWordsDisplay = document.getElementById("incorrectWords");

const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");

const restartBtn = document.getElementById("restartBtn");

const result = document.getElementById("result");

const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");
const finalCorrect = document.getElementById("finalCorrect");
const finalIncorrect = document.getElementById("finalIncorrect");

const tryAgainBtn = document.getElementById("tryAgainBtn");

const themeBtn = document.getElementById("themeBtn");

const durationButtons = document.querySelectorAll(".duration-btn");


// ========================================
// VARIABLES
// ========================================

let selectedTime = 30;

let timeLeft = selectedTime;

let timer = null;

let testStarted = false;

let testFinished = false;

let currentText = "";


// ========================================
// PERSONAL BEST
// ========================================

let personalBest = Number(
    localStorage.getItem("typingPersonalBest")
) || 0;

bestDisplay.textContent = personalBest;


// ========================================
// GET RANDOM TEXT
// ========================================

function getRandomText() {

    const randomIndex = Math.floor(
        Math.random() * paragraphs.length
    );

    return paragraphs[randomIndex].replace(/\s+/g, " ").trim();
}


// ========================================
// LOAD TEXT
// ========================================

function loadText() {

    currentText = getRandomText();

    textDisplay.innerHTML = "";

    currentText.split("").forEach((character, index) => {

        const span = document.createElement("span");

        span.textContent = character;

        if (index === 0) {
            span.classList.add("current");
        }

        textDisplay.appendChild(span);

    });
}


// ========================================
// RESET TEST
// ========================================

function resetTest() {

    clearInterval(timer);

    timer = null;

    testStarted = false;

    testFinished = false;

    timeLeft = selectedTime;

    timeDisplay.textContent = timeLeft;

    wpmDisplay.textContent = "0";

    accuracyDisplay.textContent = "100%";

    correctWordsDisplay.textContent = "0";

    incorrectWordsDisplay.textContent = "0";

    progress.style.width = "0%";

    progressText.textContent = "0%";

    typingInput.value = "";

    typingInput.disabled = false;

    result.classList.add("hidden");

    loadText();

    typingInput.focus();
}


// ========================================
// START TIMER
// ========================================

function startTimer() {

    if (testStarted) {
        return;
    }

    testStarted = true;

    timer = setInterval(() => {

        timeLeft--;

        timeDisplay.textContent = timeLeft;

        updateStats();

        if (timeLeft <= 0) {

            finishTest();

        }

    }, 1000);
}


// ========================================
// UPDATE TYPING DISPLAY
// ========================================

function updateTypingDisplay() {

    const typedText = typingInput.value;

    const characters = textDisplay.querySelectorAll("span");

    let correctCharacters = 0;

    characters.forEach((character, index) => {

        character.classList.remove(
            "correct",
            "incorrect",
            "current"
        );

        if (index < typedText.length) {

            const typedCharacter = typedText[index];
            const targetCharacter = currentText[index];
            const charactersMatch =
                typedCharacter === targetCharacter ||
                (/\s/.test(typedCharacter) && /\s/.test(targetCharacter));

            if (charactersMatch) {

                character.classList.add("correct");

                correctCharacters++;

            } else {

                character.classList.add("incorrect");

            }

        }

    });


    // Highlight next character
    if (typedText.length < characters.length) {

        characters[typedText.length]
            .classList.add("current");

    }


    // Update progress
    const percentage =
        (typedText.length / currentText.length) * 100;

    const progressValue =
        Math.min(percentage, 100);

    progress.style.width =
        progressValue + "%";

    progressText.textContent =
        Math.round(progressValue) + "%";


    // If paragraph completed
    if (typedText.length >= currentText.length) {

        const oldText = currentText;

        loadText();

        typingInput.value = "";

        // Keep the completed paragraph's effect
        console.log("Completed:", oldText);

    }

}


// ========================================
// CALCULATE WORDS
// ========================================

function calculateWords() {

    const typedText = typingInput.value.trim();

    if (typedText === "") {

        return {
            correct: 0,
            incorrect: 0
        };

    }


    const typedWords = typedText.split(/\s+/);

    const targetWords = currentText.split(/\s+/);


    let correct = 0;

    let incorrect = 0;


    typedWords.forEach((word, index) => {

        if (index >= targetWords.length) {

            incorrect++;

            return;

        }


        if (word === targetWords[index]) {

            correct++;

        } else {

            incorrect++;

        }

    });


    return {
        correct,
        incorrect
    };

}


// ========================================
// UPDATE STATS
// ========================================

function updateStats() {

    const typedText = typingInput.value;

    if (typedText.length === 0) {

        wpmDisplay.textContent = "0";

        accuracyDisplay.textContent = "100%";

        return;

    }


    // Time elapsed
    const elapsedSeconds =
        selectedTime - timeLeft;


    if (elapsedSeconds <= 0) {
        return;
    }


    // Correct characters
    let correctCharacters = 0;

    for (
        let i = 0;
        i < typedText.length && i < currentText.length;
        i++
    ) {

        if (
            typedText[i] === currentText[i]
        ) {

            correctCharacters++;

        }

    }


    // WPM
    const minutes =
        elapsedSeconds / 60;

    const wpm =
        Math.round(
            (correctCharacters / 5) / minutes
        );


    // Accuracy
    const accuracy =
        Math.round(
            (correctCharacters / typedText.length) * 100
        );


    const words = calculateWords();


    wpmDisplay.textContent =
        Math.max(wpm, 0);

    accuracyDisplay.textContent =
        Math.max(accuracy, 0) + "%";

    correctWordsDisplay.textContent =
        words.correct;

    incorrectWordsDisplay.textContent =
        words.incorrect;

}


// ========================================
// FINISH TEST
// ========================================

function finishTest() {

    clearInterval(timer);

    timer = null;

    testFinished = true;

    typingInput.disabled = true;


    updateStats();


    const wpm =
        Number(wpmDisplay.textContent);

    const accuracy =
        accuracyDisplay.textContent;

    const correct =
        Number(correctWordsDisplay.textContent);

    const incorrect =
        Number(incorrectWordsDisplay.textContent);


    // Update personal best
    if (wpm > personalBest) {

        personalBest = wpm;

        localStorage.setItem(
            "typingPersonalBest",
            personalBest
        );

        bestDisplay.textContent =
            personalBest;

    }


    // Result screen
    finalWpm.textContent = wpm;

    finalAccuracy.textContent = accuracy;

    finalCorrect.textContent = correct;

    finalIncorrect.textContent = incorrect;

    result.classList.remove("hidden");

}


// ========================================
// TYPING INPUT
// ========================================

typingInput.addEventListener("keydown", event => {

    if (event.key !== "Enter") {
        return;
    }

    event.preventDefault();

    const start = typingInput.selectionStart;
    const end = typingInput.selectionEnd;
    const before = typingInput.value.slice(0, start).replace(/\s+$/, "");
    const after = typingInput.value.slice(end).replace(/^\s+/, "");
    const separator = /\s/.test(currentText[before.length] || "")
        ? " "
        : "";

    typingInput.value = before + separator + after;

    const caretPosition = before.length + separator.length;

    typingInput.setSelectionRange(caretPosition, caretPosition);
    typingInput.dispatchEvent(new Event("input", { bubbles: true }));

});

typingCard.addEventListener("click", event => {

    if (event.target !== typingInput && !testFinished) {
        typingInput.focus();
    }

});

document.addEventListener("keydown", event => {

    if (
        event.key === "Enter" &&
        document.activeElement !== typingInput &&
        !testFinished &&
        !(event.target instanceof HTMLButtonElement)
    ) {
        event.preventDefault();
        typingInput.focus();
    }

});

typingInput.addEventListener("input", () => {

    if (testFinished) {
        return;
    }

    const caretPosition = typingInput.selectionStart;
    const normalizedBeforeCaret = typingInput.value
        .slice(0, caretPosition)
        .replace(/\s+/g, " ");
    const normalizedValue = typingInput.value.replace(/\s+/g, " ");

    if (typingInput.value !== normalizedValue) {
        typingInput.value = normalizedValue;
        typingInput.setSelectionRange(
            normalizedBeforeCaret.length,
            normalizedBeforeCaret.length
        );
    }


    // Start timer on first character
    if (!testStarted && typingInput.value.length > 0) {

        startTimer();

    }


    updateTypingDisplay();

    updateStats();

});


// ========================================
// DURATION BUTTONS
// ========================================

durationButtons.forEach(button => {

    button.addEventListener("click", () => {

        durationButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        selectedTime =
            Number(button.dataset.time);


        resetTest();

    });

});


// ========================================
// RESTART BUTTON
// ========================================

restartBtn.addEventListener("click", () => {

    resetTest();

});


// ========================================
// TRY AGAIN
// ========================================

tryAgainBtn.addEventListener("click", () => {

    resetTest();

});


// ========================================
// DARK / LIGHT MODE
// ========================================

function loadTheme() {

    const savedTheme =
        localStorage.getItem("typingTheme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeBtn.textContent = "☀️";

    } else {

        document.body.classList.remove("dark");

        themeBtn.textContent = "🌙";

    }

}


themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");


    const isDark =
        document.body.classList.contains("dark");


    if (isDark) {

        localStorage.setItem(
            "typingTheme",
            "dark"
        );

        themeBtn.textContent = "☀️";

    } else {

        localStorage.setItem(
            "typingTheme",
            "light"
        );

        themeBtn.textContent = "🌙";

    }

});


// ========================================
// KEYBOARD SHORTCUT
// ========================================

document.addEventListener("keydown", event => {

    // Ctrl + R = restart
    if (
        event.ctrlKey &&
        event.key.toLowerCase() === "r"
    ) {

        event.preventDefault();

        resetTest();

    }

});


// ========================================
// INITIALIZE
// ========================================

loadTheme();

resetTest();