// Variables globales para el juego
let currentOperation = {
    num1: 0,
    num2: 0,
    correctAnswer: 0,
    options: []
};

let scores = {
    correct: 0,
    wrong: 0
};

// Elementos del DOM
const num1Element = document.getElementById('num1');
const num2Element = document.getElementById('num2');
const optionButtons = [
    document.getElementById('option1'),
    document.getElementById('option2'),
    document.getElementById('option3')
];
const correctAnswersElement = document.getElementById('correct-answers');
const wrongAnswersElement = document.getElementById('wrong-answers');
const newOperationBtn = document.getElementById('new-operation');
const resultMessage = document.getElementById('result-message');

// Función para generar números aleatorios de dos cifras (10-99)
function generateTwoDigitNumber() {
    return Math.floor(Math.random() * 90) + 10; // Números del 10 al 99
}

// Función para generar opciones incorrectas
function generateWrongOptions(correctAnswer) {
    const wrongOptions = [];
    
    // Generar opciones incorrectas que sean diferentes entre sí y del resultado correcto
    while (wrongOptions.length < 2) {
        // Generar opciones cercanas al resultado correcto (±10)
        const variation = Math.floor(Math.random() * 21) - 10; // -10 a +10
        let wrongOption = correctAnswer + variation;
        
        // Asegurar que esté en el rango de dos cifras (10-199)
        if (wrongOption < 10) wrongOption = 10 + Math.abs(wrongOption);
        if (wrongOption > 199) wrongOption = 199 - (wrongOption - 199);
        
        // Verificar que no sea igual al resultado correcto ni a las opciones ya generadas
        if (wrongOption !== correctAnswer && !wrongOptions.includes(wrongOption)) {
            wrongOptions.push(wrongOption);
        }
    }
    
    return wrongOptions;
}

// Función para mezclar un array (algoritmo Fisher-Yates)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Función para generar una nueva operación
function generateNewOperation() {
    // Generar números de dos cifras
    const num1 = generateTwoDigitNumber();
    const num2 = generateTwoDigitNumber();
    const correctAnswer = num1 + num2;
    
    // Generar opciones incorrectas
    const wrongOptions = generateWrongOptions(correctAnswer);
    
    // Crear array con todas las opciones y mezclarlas
    const allOptions = [correctAnswer, ...wrongOptions];
    const shuffledOptions = shuffleArray(allOptions);
    
    // Actualizar la operación actual
    currentOperation = {
        num1: num1,
        num2: num2,
        correctAnswer: correctAnswer,
        options: shuffledOptions
    };
    
    // Actualizar la interfaz
    updateInterface();
    
    // Ocultar botón de nueva operación y mensaje de resultado
    newOperationBtn.style.display = 'none';
    resultMessage.classList.remove('show', 'correct', 'incorrect');
}

// Función para actualizar la interfaz
function updateInterface() {
    // Actualizar números de la operación
    num1Element.textContent = currentOperation.num1;
    num2Element.textContent = currentOperation.num2;
    
    // Actualizar opciones en los botones
    optionButtons.forEach((button, index) => {
        button.textContent = currentOperation.options[index];
        button.className = 'option-btn'; // Resetear clases
        button.disabled = false; // Habilitar botones
    });
    
    // Actualizar puntuación
    correctAnswersElement.textContent = scores.correct;
    wrongAnswersElement.textContent = scores.wrong;
}

// Función para verificar la respuesta
function checkAnswer(selectedIndex) {
    const selectedAnswer = currentOperation.options[selectedIndex];
    const isCorrect = selectedAnswer === currentOperation.correctAnswer;
    
    // Deshabilitar todos los botones
    optionButtons.forEach(button => {
        button.disabled = true;
        button.classList.add('disabled');
    });
    
    // Marcar el botón seleccionado
    if (isCorrect) {
        optionButtons[selectedIndex].classList.add('correct');
        scores.correct++;
        showCorrectMessage();
        createCelebration();
    } else {
        optionButtons[selectedIndex].classList.add('incorrect');
        scores.wrong++;
        showIncorrectMessage();
        
        // Mostrar cuál era la respuesta correcta
        optionButtons.forEach((button, index) => {
            if (currentOperation.options[index] === currentOperation.correctAnswer) {
                button.classList.add('correct');
            }
        });
    }
    
    // Mostrar botón de nueva operación
    newOperationBtn.style.display = 'inline-block';
}

// Función para mostrar mensaje de respuesta correcta
function showCorrectMessage() {
    const messages = [
        '¡Excelente! 🎉',
        '¡Perfecto! ⭐',
        '¡Muy bien! 🏆',
        '¡Correcto! 🎯',
        '¡Genial! 🌟'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    resultMessage.textContent = randomMessage;
    resultMessage.className = 'result-message show correct';
}

// Función para mostrar mensaje de respuesta incorrecta
function showIncorrectMessage() {
    const messages = [
        '¡Ups! Inténtalo de nuevo 💪',
        '¡Casi! Sigue practicando 📚',
        '¡No te rindas! ¡Tú puedes! 💪',
        '¡Sigue intentando! 🎯',
        '¡La próxima vez será! 🌟'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    resultMessage.textContent = randomMessage;
    resultMessage.className = 'result-message show incorrect';
}

// Función para crear efecto de celebración
function createCelebration() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    
    // Crear confeti
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        celebration.appendChild(confetti);
    }
    
    document.body.appendChild(celebration);
    
    // Remover el efecto después de 3 segundos
    setTimeout(() => {
        document.body.removeChild(celebration);
    }, 3000);
}

// Función para reiniciar el juego
function resetGame() {
    scores.correct = 0;
    scores.wrong = 0;
    generateNewOperation();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Generar la primera operación al cargar la página
    generateNewOperation();
    
    // Agregar event listener para teclas
    document.addEventListener('keydown', function(event) {
        if (event.key >= '1' && event.key <= '3') {
            const index = parseInt(event.key) - 1;
            if (!optionButtons[index].disabled) {
                checkAnswer(index);
            }
        } else if (event.key === 'Enter' || event.key === ' ') {
            if (newOperationBtn.style.display !== 'none') {
                generateNewOperation();
            }
        }
    });
});

// Función para exportar puntuación (opcional)
function exportScore() {
    const scoreData = {
        correct: scores.correct,
        wrong: scores.wrong,
        total: scores.correct + scores.wrong,
        accuracy: scores.correct / (scores.correct + scores.wrong) * 100
    };
    
    console.log('Puntuación actual:', scoreData);
    return scoreData;
} 