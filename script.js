"use strict";

const budgetInput = document.querySelector('.budget_input');
const expTextInput = document.querySelector('.expense_text_input');
const expInput = document.querySelector('.expense_amount_input'); 
const tabledata = document.querySelector('.table_data');
const cardsContainer = document.querySelector('.cards');

const budcard = document.querySelector('.budget_card');
const expcard = document.querySelector('.expense_card');
const balcard = document.querySelector('.balance_card');

let itemId = 1;
let itemList = [];

function btnEvents() {
    const budgetBtn = document.querySelector('#btn_budget');
    const expenseBtn = document.querySelector('#btn_expense');

    budgetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        budgetFun();
    });

    expenseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        expenseFun();
    });
}

document.addEventListener("DOMContentLoaded", btnEvents);

function budgetFun() {
    const budgetValue = Number(budgetInput.value);
    if (budgetValue <= 0 || isNaN(budgetValue)) {
        alert("Please enter a value greater than 0");
    } else {
        budcard.textContent = budgetInput.value;
        budgetInput.value = "";
        showbal();
    }
}

function expenseFun() {
    const expenseValue = Number(expInput.value);
    const expenseDesc = expTextInput.value;
    if (expenseDesc === "" || isNaN(expenseValue) || expenseValue < 0) {
        alert("Please enter a valid expense description and amount");
    } else {
        expcard.textContent = Number(expcard.textContent) + expenseValue;
        expInput.value = "";
        expTextInput.value = "";
        showbal();

        let expenses = {
            id: itemId,
            title: expenseDesc,
            amount: expenseValue
        };
        itemList.push(expenses);
        itemId = itemList.length + 1; // Set itemId for next expense
        renderTransactions();
    }
}

function renderTransactions() {
    tabledata.innerHTML = ''; // Clear existing transactions
    itemList.forEach((item, index) => {
        item.id = index + 1; // Reassign IDs
        const html = `
            <ul type="none" class="transactions" data-id="${item.id}">
                <li>${item.id}</li>
                <li>${item.title}</li>
                <li><span>₹</span>${item.amount}</li>
                <li>
                    <button type="button" class="btn_edit">Edit</button>
                    <button type="button" class="btn_delete">Delete</button>
                </li>
            </ul>`;
        tabledata.insertAdjacentHTML("beforeend", html);
    });
    attachEventListeners(); // Attach event listeners to the newly rendered buttons
}

function attachEventListeners() {
    // Edit and Delete buttons within transactions
    const btnEdit = document.querySelectorAll(".btn_edit");
    const btnDelete = document.querySelectorAll(".btn_delete");

    btnEdit.forEach(button => {
        button.addEventListener('click', (e) => {
            const li = e.target.closest('ul.transactions');
            const id = li.getAttribute('data-id');
            const expense = itemList.find(item => item.id == id);

            if (expense) {
                expTextInput.value = expense.title;
                expInput.value = expense.amount;
                itemList = itemList.filter(item => item.id != id); // Remove the item from the list
                expcard.textContent = Number(expcard.textContent) - expense.amount;
                showbal();
                renderTransactions(); // Re-render transactions with updated IDs
            }
        });
    });

    btnDelete.forEach(button => {
        button.addEventListener('click', (e) => {
            const li = e.target.closest('ul.transactions');
            const id = li.getAttribute('data-id');
            const expense = itemList.find(item => item.id == id);

            if (expense) {
                expcard.textContent = Number(expcard.textContent) - expense.amount;
                itemList = itemList.filter(item => item.id != id); // Remove the item from the list
                li.remove(); // Remove the item from the DOM
                showbal();
                renderTransactions(); // Re-render transactions with updated IDs
            }
        });
    });
}

function showbal() {
    let bal = parseInt(budcard.textContent) - parseInt(expcard.textContent);
    balcard.textContent = bal;
}
