'use strict';

const firstResolvedMsg = 'First promise was resolved';
const firstRejectedMsg = 'First promise was rejected';
const secondResolvedMsg = 'Second promise was resolved';
const thirdResolvedMsg = 'Third promise was resolved';

let firstResolved = false;
let firstRejected = false;

let secondResolved = false;
let thirdResolved = false;

const thirdClicks = {
  left: false,
  right: false,
};

function showNotification(msg) {
  let notification = document.querySelector('[data-qa=notification]');

  if (!notification) {
    notification = document.createElement('div');
    notification.setAttribute('data-qa', 'notification');
    document.body.appendChild(notification);
  }
  notification.textContent = msg;
}

function clearNotification() {
  const notification = document.querySelector('[data-qa=notification]');

  if (notification) {
    notification.remove();
  }
}

// First Promise:
function firstPromise() {
  return new Promise((resolve, reject) => {
    function onClick(e) {
      if (e.button === 0 && !firstResolved && !firstRejected) {
        firstResolved = true;
        resolve(firstResolvedMsg);
        clearTimeout(timeoutId);
        document.body.removeEventListener('click', onClick);
      }
    }

    document.body.addEventListener('click', onClick);

    const timeoutId = setTimeout(() => {
      if (!firstResolved) {
        firstRejected = true;
        reject(new Error(firstRejectedMsg));
        // eslint prefer-promise-reject-errors
        document.body.removeEventListener('click', onClick);
      }
    }, 3000);
  });
}

// Second Promise: resolve on left or right click, only once
function secondPromise() {
  return new Promise((resolve) => {
    function onClick(e) {
      if (!secondResolved && (e.button === 0 || e.button === 2)) {
        secondResolved = true;
        resolve(secondResolvedMsg);
        document.body.removeEventListener('click', onClick);
        document.body.removeEventListener('contextmenu', onClick);
      }
    }

    document.body.addEventListener('click', onClick);
    document.body.addEventListener('contextmenu', onClick);
  });
}

// Third Promise:
function thirdPromise() {
  return new Promise((resolve) => {
    function onLeftClick(e) {
      if (e.button === 0) {
        thirdClicks.left = true;
        checkResolve();
      }
    }

    function onRightClick(e) {
      if (e.button === 2) {
        thirdClicks.right = true;
        checkResolve();
      }
    }

    function checkResolve() {
      if (!thirdResolved && thirdClicks.left && thirdClicks.right) {
        thirdResolved = true;
        resolve(thirdResolvedMsg);
        document.body.removeEventListener('click', onLeftClick);
        document.body.removeEventListener('contextmenu', onRightClick);
      }
    }

    document.body.addEventListener('click', onLeftClick);
    document.body.addEventListener('contextmenu', onRightClick);
  });
}

// Запускаємо проміси та показуємо повідомлення
firstPromise()
  .then((msg) => {
    showNotification(msg);
  })
  .catch((err) => {
    showNotification(err.message);
  });

secondPromise().then((msg) => {
  showNotification(msg);
});

thirdPromise().then((msg) => {
  showNotification(msg);
});

clearNotification();
