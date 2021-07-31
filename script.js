'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Hrithik Gupta',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2021-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-07-24T14:11:59.604Z',
    '2021-07-25T17:01:17.194Z',
    '2021-07-29T23:36:17.929Z',
    '2021-07-31T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Pradeep Shukla',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

///////////////////// project ////////////////////////////

const setLogOutTimer = function () {
  let time = 300;
  const tick = function () {
    const min = `${Math.floor(time / 60)}`.padStart(2, 0);
    const sec = `${time % 60}`.padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time == 0) {
      containerApp.style.opacity = 0;
      clearInterval(timer);
    }
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

const formattedCurrency = (value, locale, curr) =>
  new Intl.NumberFormat(locale, { style: 'currency', currency: curr }).format(
    value
  );

const formattedDate = function (acc, date) {
  const daysPassed = (date1, date2) =>
    Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));
  const date1 = new Date();
  const days = daysPassed(date1, date);
  // console.log(date1, date);
  if (days == 0) {
    return 'Today';
  } else if (days == 1) {
    return 'Yesterday';
  } else if (days <= 7) {
    return `${days} days ago`;
  }
  const now = date;
  const options = {
    // hour: 'numeric',
    // minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    // weekday: 'long',
  };

  const date3 = new Intl.DateTimeFormat(acc.locale, options).format(now);

  return date3;
};

const display = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movements = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formattedDate(acc, date);

    const formattedCur = formattedCurrency(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
       <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedCur}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayBalance = function (acc1) {
  // console.log(acc1.movements);
  acc1.balance = acc1.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = formattedCurrency(
    acc1.balance,
    acc1.locale,
    acc1.currency
  );
};

const displaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formattedCurrency(income, acc.locale, acc.currency);

  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = formattedCurrency(
    outcome,
    acc.locale,
    acc.currency
  );

  const totInterest = acc.movements
    .filter(mov => mov > 0)
    .map(deposits => deposits * (acc.interestRate / 100))
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => interest + acc, 0);

  labelSumInterest.textContent = formattedCurrency(
    totInterest,
    acc.locale,
    acc.currency
  );
};

const updateUI = function (currentUser) {
  displayBalance(currentUser);
  display(currentUser);
  displaySummary(currentUser);
};

updateUI(account1);
containerApp.style.opacity = 100;

const makeUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(Name => Name[0])
      .join('');
  });
};

makeUsernames(accounts);
// console.log(accounts);
let currentUser, timer;
btnLogin.addEventListener('click touchstart', function (e) {
  e.preventDefault();
  currentUser = accounts.find(acc => acc.userName === inputLoginUsername.value);
  // console.log(currentUser);
  inputLoginPin.blur();
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;

    labelWelcome.textContent = `Welcome back,${
      currentUser.owner.split(' ')[0]
    }`;
    updateUI(currentUser);
  }
  inputLoginPin.value = inputLoginUsername.value = '';

  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    // weekday: 'long',
  };

  labelDate.textContent = new Intl.DateTimeFormat(
    currentUser.locale,
    options
  ).format(now);
  if (timer) clearInterval(timer);
  timer = setLogOutTimer();
  // const now = new Date();
  // const day = `${now.getDate()}`.padStart(2, 0);
  // const month = `${now.getMonth() + 1}`.padStart(2, 0);
  // const year = now.getFullYear();
  // const hour = `${now.getHours()}`.padStart(2, 0);
  // const min = `${now.getMinutes()}`.padStart(2, 0);

  // const date = `${day}/${month}/${year} ${hour}:${min}`;
  // labelDate.textContent = date;
});

btnTransfer.addEventListener('click touchstart', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  // console.log(amount, recieverAcc);

  if (
    amount > 0 &&
    recieverAcc &&
    recieverAcc !== currentUser &&
    currentUser.balance >= amount
  ) {
    currentUser.movements.push(-amount);
    recieverAcc.movements.push(amount);
    currentUser.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());
    updateUI(recieverAcc);

    updateUI(currentUser);
    clearInterval(timer);
    timer = setLogOutTimer();
    // console.log(currentUser.movements);
  }

  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
});

btnLoan.addEventListener('click touchstart', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentUser.movements.some(mov => mov > 0 && mov >= amount * 0.1)
  ) {
    currentUser.movements.push(amount);
    currentUser.movementsDates.push(new Date().toISOString());
    setTimeout(function () {
      updateUI(currentUser);
      clearInterval(timer);
      timer = setLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

btnClose.addEventListener('click touchstart', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentUser.userName &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    const idx = accounts.findIndex(
      acc => acc.userName === inputCloseUsername.value
    );

    accounts.splice(idx, 1);
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
  inputClosePin.blur();
  labelWelcome.textContent = 'Log in to get started';
});

let sorted = false;

btnSort.addEventListener('click touchstart', function (e) {
  e.preventDefault();
  display(currentUser, !sorted);
  sorted = !sorted;
});

containerApp.style.opacity = 0;

// const daysPassed = (date1, date2) =>
//   Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));

// console.log(daysPassed(new Date(2021, 8, 20), new Date(2021, 8, 20)));

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const radnomNum = (min, max) =>
  Math.trunc(Math.random() * (max + 1 - min) + 1) + (min - 1);

// for (let i = 0; i < 100; i++) {
//   console.log(radnomNum(100, 250), radnomNum(100, 250), radnomNum(100, 250));
// }

// for (let i = 0; i < 100; i++) {
//   console.log(radnomNum(10, 20));
// }
