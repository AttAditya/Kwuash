var balance = 0.00;

function load_local_history() {
    balance = localStorage.getItem("balance");
    if (!balance) {
        balance = "0";
    }

    balance = Number(balance);

    let balance_element = document.getElementById("balance-amount");
    balance_element.innerHTML = Math.floor(balance * 100) / 100;

    let history = localStorage.getItem("history");
    if (!history) {
        history = "[]";
    }

    history = JSON.parse(history);

    for (let transaction_data of history) {
        let amount = transaction_data.amount;
        let reason = transaction_data.reason;
        let time = transaction_data.time;
        let date = transaction_data.date;
        let direction = transaction_data.direction;

        push_message({
            currency: "₹",
            amount: amount,
            description: reason,
            time: time,
            date: date
        }, direction);
    }
}

function save_to_local_history(amount, reason, time, date, direction) {
    localStorage.setItem("balance", balance);
    let history = localStorage.getItem("history");
    if (!history) {
        history = "[]";
    }

    history = JSON.parse(history);

    history.push({
        amount: Math.abs(amount),
        reason: reason,
        time: time,
        date: date,
        direction: direction
    });

    localStorage.setItem("history", JSON.stringify(history));
}

function update_balance(amount, reason, time, date, direction) {
    balance += amount;
    save_to_local_history(amount, reason, time, date, direction);

    let balance_element = document.getElementById("balance-amount");
    balance_element.innerHTML = Math.floor(balance * 100) / 100;
}

function push_message_in(message) {
    let message_container = document.getElementById("message-container");
    let message_template = `
        <div class="message message-left-side">
            <div class="message-box message-success">
                <h1 class="message-amount">
                    <span class="message-currency">${message.currency}</span>
                    <span class="message-value">${message.amount}</span>
                </h1>
                <h2 class="message-description">
                    ${message.description}
                </h2>
                <div class="message-datetime">
                    <p class="message-time">
                        ${message.time}
                    </p>
                    <p class="message-date">
                        ${message.date}
                    </p>
                </div>
            </div>
        </div>
    `;

    message_container.innerHTML += message_template;
}

function push_message_out(message) {
    let message_container = document.getElementById("message-container");
    let message_template = `
        <div class="message message-right-side">
            <div class="message-box message-danger">
                <h1 class="message-amount">
                    <span class="message-currency">${message.currency}</span>
                    <span class="message-value">${message.amount}</span>
                </h1>
                <h2 class="message-description">
                    ${message.description}
                </h2>
                <div class="message-datetime">
                    <p class="message-time">
                        ${message.time}
                    </p>
                    <p class="message-date">
                        ${message.date}
                    </p>
                </div>
            </div>
        </div>
    `;

    message_container.innerHTML += message_template;
}

function push_message(message, direction) {
    if (direction == "in") {
        push_message_in(message);
    } else {
        push_message_out(message);
    }

    let message_container = document.getElementById("message-container");
    message_container.scrollTo(0, message_container.scrollHeight, { behavior: "smooth" });
}

function add_in_money() {
    let amount = prompt("Enter amount");
    if (!amount) {
        alert("Please enter amount!");
        return;
    }

    let reason = prompt("Enter reason");
    if (!reason) {
        alert("Please enter reason!");
        return;
    }

    amount = Number(amount);

    if (isNaN(amount)) {
        alert("Please enter a valid amount!");
        return;
    }

    let datetime = new Date();
    let time_string = datetime.toLocaleTimeString();
    let date_string = datetime.toLocaleDateString();

    update_balance(amount, reason, time_string, date_string, "in");

    push_message({
        currency: "₹",
        amount: amount,
        description: reason,
        time: time_string,
        date: date_string
    }, "in");
}

function add_out_money() {
    let amount = prompt("Enter amount");
    if (!amount) {
        alert("Please enter amount!");
        return;
    }

    let reason = prompt("Enter reason");
    if (!reason) {
        alert("Please enter reason!");
        return;
    }

    amount = Number(amount);

    if (isNaN(amount)) {
        alert("Please enter a valid amount!");
        return;
    }

    let datetime = new Date();
    let time_string = datetime.toLocaleTimeString();
    let date_string = datetime.toLocaleDateString();

    update_balance(-amount, reason, time_string, date_string, "out");

    push_message({
        currency: "₹",
        amount: amount,
        description: reason,
        time: time_string,
        date: date_string
    }, "out");
}

function init() {
    load_local_history();
}

