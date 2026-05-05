/*  display at 0 */
const display = document.getElementById("display");
display.textContent = "0";

/*  initalize values */
let currentInput = "";
let previousValue = null;
let operator = null;
let error = false;

/*  calculator buttons */
const buttons = document.querySelectorAll("#buttons button");
buttons.forEach(button => {
    button.addEventListener("click", () => {
        handleInput(button.textContent.trim());
    });
});


/*  keyboard input */
document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (!isNaN(key) || key === "." || ["+","-","*","/"].includes(key)) // number, decimal, or operand
        handleInput(key);
    else if (key === "Enter" || key === "=") //enter or =
        handleInput("=");
    else if (key === "Backspace") // backspace
        clearCalculator();
    else if (key.toUpperCase() === "C") // clear
        handleInput("C");
});

/* handle input */
function handleInput(value) {
    if (display.textContent === "Error" && value === "C") { // error then clear
        clearCalculator();
    }

    if (error) // if no C then dont take input when theres error
        return;
    
    // number or decimal
    if (!isNaN(value) || value === ".") { 
        if (previousValue !== null && operator === null && currentInput === "")  // new calculation
            previousValue = null; // clear prev
        
        if (value === "." && currentInput.includes(".")) // already has decimal
            return; //return

        if (value === "." && currentInput === "") { // decimal with nothing in front is 0
            currentInput = "0.";
            updateDisplay();
            return;
        }

        currentInput += value; //concatenate value entered
        updateDisplay();
        return;
    }

    // clear
    if (value === "C") {
        clearCalculator();
        return;
    }

    // operator
    if (["+", "-", "*", "/"].includes(value)) {
        if (value === "-" && currentInput === "" && previousValue === null) { // if - is only thing entered becomes 0-
            previousValue = 0;
            operator = "-";
            currentInput = "";
            updateDisplay();
            return;
        }
        if (previousValue !== null && currentInput !== "") { // calculate operand if theres a previous and current (2 numbers already)
            calculate();
        }

        if (previousValue === null && currentInput !== "") { // current becomes previous (waiting for 2nd number)
            previousValue = parseFloat(currentInput);
            currentInput = ""
        }
        operator = value; // save operator for next calculation
        if (currentInput && currentInput !== "") 
            currentInput = "";

        updateDisplay();
        return;
    }

    // equals
    if (value === "=") {
        if (operator !== null && currentInput !== "") // calculate equation
            calculate();
        else if (operator !== null && currentInput === "") // no second number so make 0
            calculate();
        updateDisplay(); 
    }
}

/* history list */
const historyList = document.querySelector("#history ul");

/* calculate */
function calculate() {
    let current = parseFloat(currentInput);
    if (isNaN(current)) // if empty then set to 0 for error
        current = 0;
    let result;

    if (currentInput === "") // if only 1 number and operand and not 2nd number
        return; // don't calculate

    switch (operator) {
        case "+": // add
            result = previousValue + current; 
            break;
        case "-":  // subtract
            result = previousValue - current; 
            break;
        case "*":  // multiply
            result = previousValue * current; 
            break;
        case "/":  // divide
            if (current === 0)
                return showError(); // error for dividing by 0
            result = previousValue / current;
            break;
    }

    if (!Number.isFinite(result)) // if not number then error
        return showError(); 
        

    // add result to history
    if (result) { 
        const item = document.createElement("li");
        item.textContent = result;
        historyList.appendChild(item);
    }

    // update display and shift
    previousValue = result;
    currentInput = "";
    operator = null;
    updateDisplay();
}

/* update display */
function updateDisplay() {
    if(error)
        return;
    if (operator !== null && previousValue !== null) // keep equation if no result
        display.textContent = `${previousValue}${operator}${currentInput}`;
    else {
        if (previousValue != null )  // display previous if available
            display.textContent = previousValue;
        else if (currentInput !== null) // display current if available
            display.textContent = currentInput;
        else  // else display 0
            display.textContent = "0";
    }
}

/* clear calculator */
function clearCalculator() {
    currentInput = ""; // reset everything
    previousValue = null;
    operator = null;
    error = false;
    display.textContent = "0"; // clear = zero
}


/* clear history */
const clearHistory = document.querySelector("#clear-history button");
clearHistory.addEventListener("click", () => {
    historyList.replaceChildren(); // delete all items in history
});

/* error on display */
function showError() {
    display.textContent = "Error";
    error = true;
    currentInput = ""; // reset everything
    previousValue = null;
    operator = null;
}
