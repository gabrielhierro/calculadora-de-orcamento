const balanceEl = document.querySelector("#balance");
const moneyPlusEl = document.querySelector("#money-plus");
const moneyMinusEl = document.querySelector("#money-minus");
const listEl = document.querySelector("#list");
const form = document.querySelector("#form");
const textInput = document.querySelector("#text");
const amountInput = document.querySelector("#amount");

function init() {
  listEl.innerHTML = "";
  Model.transactions.forEach(View.addTransactionDOM);
  View.updateValues();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (textInput.value.trim() === "" || amountInput.value.trim() === "") {
    alert("Por favor, preencha a descrição e o valor.");
  } else {
    const transaction = {
      id: generateID(),
      text: textInput.value,
      amount: parseFloat(amountInput.value),
    };

    Model.addTransaction(transaction);
    View.addTransactionDOM(transaction);
    View.updateValues();

    textInput.value = "";
    amountInput.value = "";
  }
});

function generateID() {
  return Math.floor(Math.random() * 100000000);
}

function deleteTransaction(id) {
  Model.removeTransaction(id);
  init();
}

const Model = {
  transactions: [],

  addTransaction(transaction) {
    this.transactions.push(transaction);
  },

  removeTransaction(id) {
    this.transactions = this.transactions.filter(
      (transaction) => transaction.id !== id
    );
  },

  getIncome() {
    return this.transactions
      .filter((transaction) => transaction.amount > 0)
      .reduce((acc, transaction) => acc + transaction.amount, 0);
  },

  getExpenses() {
    return this.transactions
      .filter((transaction) => transaction.amount < 0)
      .reduce((acc, transaction) => acc + transaction.amount, 0);
  },

  getTotal() {
    return this.transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
  },
};

const View = {
  addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");

    item.classList.add(
      "list-group-item",
      transaction.amount < 0 ? "border-danger" : "border-success"
    );

    item.innerHTML = `
            <span>${transaction.text}</span>
            <span class="fw-bold">${sign} R$ ${Math.abs(
      transaction.amount
    ).toFixed(2)}</span>
            <button class="delete-btn" onclick="deleteTransaction(${
              transaction.id
            })">x</button>
        `;

    listEl.appendChild(item);
  },

  updateValues() {
    const total = Model.getTotal();
    const income = Model.getIncome();
    const expenses = Model.getExpenses();

    balanceEl.innerText = `R$ ${total.toFixed(2)}`;
    moneyPlusEl.innerText = `R$ ${income.toFixed(2)}`;
    moneyMinusEl.innerText = `R$ ${Math.abs(expenses).toFixed(2)}`;
  },
};

init();
