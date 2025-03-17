let firstNumber = '';
let secondNumber = '';
let currentOperation = '';
let shouldResetDisplay = false;

const displayElement = document.querySelector('.current-operand');
const previousDisplayElement = document.querySelector('.previous-operand');

function updateDisplay() {
    displayElement.textContent = formatNumber(secondNumber || '0');
    if (currentOperation) {
        previousDisplayElement.textContent = `${formatNumber(firstNumber)} ${currentOperation}`;
    } else {
        previousDisplayElement.textContent = '';
    }
}

function formatNumber(number) {
    if (number === '') return '0';
    const parts = number.toString().split('.');
    const wholePart = parts[0];
    const decimalPart = parts[1];
    
    const formattedWhole = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    if (decimalPart) {
        return `${formattedWhole}.${decimalPart}`;
    }
    return formattedWhole;
}

function addDigit(digit) {
    if (shouldResetDisplay) {
        secondNumber = '';
        shouldResetDisplay = false;
    }
    
    if (digit === '.' && secondNumber.includes('.')) return;
    
    if (secondNumber === '0' && digit !== '.') {
        secondNumber = digit;
    } else {
        secondNumber += digit;
    }
    updateDisplay();
}

function setOperation(operation) {
    if (secondNumber === '') return;
    
    if (firstNumber !== '') {
        calculate();
    }
    
    currentOperation = operation;
    firstNumber = secondNumber;
    secondNumber = '0';
    updateDisplay();
}

function calculate() {
    const num1 = parseFloat(firstNumber);
    const num2 = parseFloat(secondNumber);
    
    if (isNaN(num1) || isNaN(num2)) return;
    
    let result;
    
    switch (currentOperation) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '×':
            result = num1 * num2;
            break;
        case '÷':
            if (num2 === 0) {
                secondNumber = 'Error';
                updateDisplay();
                return;
            }
            result = num1 / num2;
            break;
        default:
            return;
    }
    
    secondNumber = result.toString();
    currentOperation = '';
    firstNumber = '';
    shouldResetDisplay = true;
    updateDisplay();
}

function clearCalculator() {
    firstNumber = '';
    secondNumber = '';
    currentOperation = '';
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLastDigit() {
    if (secondNumber === '0') return;
    secondNumber = secondNumber.slice(0, -1);
    if (secondNumber === '') secondNumber = '0';
    updateDisplay();
}

document.querySelectorAll('.number').forEach(button => {
    button.addEventListener('click', () => addDigit(button.innerText));
});

document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', () => setOperation(button.innerText));
});

document.querySelector('.equals').addEventListener('click', calculate);
document.querySelector('.clear').addEventListener('click', clearCalculator);
document.querySelector('.delete').addEventListener('click', deleteLastDigit);

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        addDigit(e.key);
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        const operationMap = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷'
        };
        setOperation(operationMap[e.key]);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Backspace') {
        deleteLastDigit();
    } else if (e.key === 'Escape') {
        clearCalculator();
    }
}); 