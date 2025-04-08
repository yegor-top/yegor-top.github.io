let activeCalculator = null;

function createCalculator() {
    let calculator = document.createElement("div");
    calculator.classList.add("calculator");

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "delete-btn");
    deleteButton.textContent = "X";
    deleteButton.onclick = function() {
        calculator.remove();
        if (activeCalculator === calculator) {
            activeCalculator = null;
        }
    };

    let display = document.createElement("input");
    display.type = "text";
    display.classList.add("display");
    display.readOnly = true;

    let buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons");

    let buttons = [
        'C', '(', ')', '/',
        '1', '2', '3', '*',
        '4', '5', '6', '-',
        '7', '8', '9', '+',
        'del', '0', '.', '=',
    ];

    buttons.forEach(value => {
        let button = document.createElement("button");
        button.classList.add("btn");
        button.textContent = value;
        button.onclick = function () {
            handleButtonClick(value, display);
        };
        buttonsContainer.appendChild(button);
    });

    calculator.appendChild(deleteButton);
    calculator.appendChild(display);
    calculator.appendChild(buttonsContainer);
    document.getElementById("calculators").appendChild(calculator);

    // Set this calculator as active when clicked
    calculator.addEventListener("click", function() {
        activeCalculator = calculator;
    });

    // Add event listener for keyboard input
    document.addEventListener("keydown", function(event) {
        if (activeCalculator === calculator) {
            handleKeyPress(event, display);
        }
    });
}

function handleButtonClick(value, display) {
    if (value === 'C') {
        display.value = '';
    } else if (value === 'del') {
        display.value = display.value.slice(0, -1);
    } else if (value === '=') {
        try {
            let result = Function("\"use strict\"; return (" + display.value + ")")();
            display.value = Number(result.toFixed(10));
        } catch {
            display.value = 'Error';
        }
    } else {
        display.value += value;
    }
}

function handleKeyPress(event, display) {
    const key = event.key;
    const validKeys = ['C', 'c', '(', ')', '/', '1', '2', '3', '*', '4', '5', '6', '-', '7', '8', '9', '+', 'Backspace', '0', '.', 'Enter'];

    if (validKeys.includes(key)) {
        event.preventDefault();
        if (key === 'Backspace') {
            handleButtonClick('del', display);
        } else if (key === 'Enter') {
            handleButtonClick('=', display);
        } else if (key === 'c') {
            handleButtonClick('C', display);
        } else {
            handleButtonClick(key, display);
        }
    }
}

document.getElementById("add-Btn").addEventListener("click", createCalculator);