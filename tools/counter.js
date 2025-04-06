let counterId = 1;

function updateCounter(id) {
    document.getElementById('counterValue' + id).textContent = window['count' + id];
}

function increment(id) {
    window['count' + id]++;
    updateCounter(id);
}

function decrement(id) {
    window['count' + id]--;
    updateCounter(id);
}

function reset(id) {
    window['count' + id] = 0;
    updateCounter(id);
}

function openModal() {
    document.getElementById('nameModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('nameModal').style.display = 'none';
    document.getElementById('counterNameInput').value = '';
}

function addNewCounter() {
    const counterName = document.getElementById('counterNameInput').value;
    if (counterName) {
        counterId++;
        let newCounter = document.createElement('div');
        newCounter.className = 'counter-container';
        newCounter.id = 'counter' + counterId;
        newCounter.innerHTML = `
                    <h1>${counterName}</h1>
                    <div class="counter" id="counterValue${counterId}">0</div>
                    <button class="btn" onclick="increment(${counterId})">+</button>
                    <button class="btn" onclick="decrement(${counterId})">-</button>
                    <button class="btn btn-reset" onclick="reset(${counterId})">Reset</button>
                    <button class="delete-btn" onclick="deleteCounter(${counterId})">X</button>
                `;
        document.getElementById('counterRow').appendChild(newCounter);
        window['count' + counterId] = 0;
        updateCounter(counterId);
        closeModal();
    } else {
        alert('Please enter a name for the counter!');
    }
}

function deleteCounter(id) {
    const counter = document.getElementById('counter' + id);
    if (counter) {
        counter.remove();
    }
}

window['count1'] = 0;
updateCounter(1);