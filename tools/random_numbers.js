function addGenerator() {
    const container = document.createElement('div');
    container.className = 'generator';

    container.innerHTML = `
            <button class="close-button" onclick="removeGenerator(this)">×</button>
            <div>
              <input type="number" placeholder="Min" class="min">
              <input type="number" placeholder="Max" class="max">
            </div>
            <button onclick="generateInThis(this)">Generate Random Number</button>
            <div class="number"></div>
        `;

    document.getElementById('generators').appendChild(container);
}

function removeGenerator(button) {
    const generator = button.closest('.generator');
    generator.remove();
}

function generateInThis(button) {
    const parent = button.closest('.generator');
    const minInput = parent.querySelector('.min');
    const maxInput = parent.querySelector('.max');
    const output = parent.querySelector('.number');

    const min = parseInt(minInput.value);
    const max = parseInt(maxInput.value);

    if (isNaN(min) || isNaN(max)) {
        output.textContent = 'Please enter both min and max!';
        return;
    }

    if (min > max) {
        output.textContent = 'Min should be less than or equal to Max!';
        return;
    }

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    output.textContent = randomNumber;
}

window.onload = addGenerator;
