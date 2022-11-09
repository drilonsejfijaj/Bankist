"use strict";

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, -450, 400, 3000, -650, -130, 70, 1300],
  interesRate: 1.2,
  pin: 1212,
};
const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, 400, 560, 20, -1300],
  interesRate: 1.5,
  pin: 2222,
};
const account3 = {
  owner: "Steven Thomas Willians",
  movements: [5000, 300, -800, 200, -650, 130, 730, -2300],
  interesRate: 0.7,
  pin: 3333,
};
const account4 = {
  owner: "Sarah  Smith",
  movements: [-200, 350, 200, 1000, -550, -230, 50, 3300],
  interesRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Creating DOM Elements
const labelValueIn = document.querySelector(".summary-value--in");
const labelValueOut = document.querySelector(".summary-value-out");
const labelValueInterest = document.querySelector(".summary-value--interest");
const containerMovements = document.querySelector(".movements");
const btnLogin = document.querySelector(".btn");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const labelWelcome = document.querySelector(".text");
const containerApp = document.querySelector(".main");
const btnTransfer = document.querySelector(".form__btn--transfer");
const inputTransfer = document.querySelector(".input--to");
const inputAmount = document.querySelector(".input--amount");
const inputCloseUser = document.querySelector(".input__close--user");
const inputClosePin = document.querySelector(".input__close--pin");
const btnClose = document.querySelector(".btn--close");
const inputLoan = document.querySelector(".input--loan");
const btnLoan = document.querySelector(".btn--loan");
const btnSort = document.querySelector(".btn--sort");

const updateUI = function (currentAccount) {
  displayMovements(currentAccount.movements);
  calcPrintBalance(currentAccount);
  calcDisplaySummary(currentAccount);
};
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
      <div class="movements__row">
        <div class="purchase purchase-type-${type}">${i + 1} ${type}</div>
        <div class="sum-of-purchase">${mov}$</div>
      </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelValueIn.innerHTML = `${incomes}$`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelValueOut.innerHTML = `${Math.abs(out)}$`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interesRate) / 100)
    .filter((acc, int, arr) => {
      return acc >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  // labelValueInterest.innerHTML = `${Math.trunc(interest)}`;
  labelValueInterest.textContent = `${interest}`;
};

createUsername(accounts);
console.log(accounts);

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  document.querySelector(".full-balance").innerHTML = `${acc.balance}$`;
};

// event handler
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount.userName);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log(currentAccount.userName);
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
  inputClosePin.value = inputCloseUser.value = "";
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputAmount.value);
  const recieverAcc = accounts.find(
    (acc) => acc.userName === inputTransfer.value
  );
  inputAmount.value = inputTransfer.value = "";
  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(-amount);
    updateUI(currentAccount);
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  let user = inputCloseUser.textContent;
  let pin = inputClosePin.textContent;
  console.log("dsds");

  if (
    inputCloseUser.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUser.value = "";
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("ddd");
  const amount = Number(inputLoan.value);
  console.log(amount);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    console.log("sukses");
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputAmount.value = "";
});
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("gg");
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
