var balance = 0.00;

function start_modal(message, body, confirm_callback, reject_callback) {
    let modal = document.getElementById("modal");

    let modal_title = document.getElementById("modal-title");
    let modal_body = document.getElementById("modal-message");

    let modal_confirm_button = document.getElementById("modal-button-confirm");
    let modal_reject_button = document.getElementById("modal-button-reject");

    modal_title.innerHTML = message;
    modal_body.innerHTML = body;

    modal_confirm_button.onclick = () => {
        modal.style.display = "none";
        if (!document.getElementById("modal-input")) {
            confirm_callback();
        } else {
            confirm_callback(document.getElementById("modal-input").value);
        }
    }

    modal_reject_button.onclick = () => {
        modal.style.display = "none";
        reject_callback();
    }

    modal.style.display = "flex";

    if (document.getElementById("modal-input")) {
        document.getElementById("modal-input").focus();
        document.getElementById("modal-input").addEventListener("keyup", (event) => {
            if (event.key.toLowerCase() == "enter") {
                event.preventDefault();
                modal_confirm_button.click();
            }
        });
    }
}

function prompt_box(message, prompt_type, confirm_callback, reject_callback) {
    start_modal(message, `
        <input id="modal-input" type="${prompt_type}" class="modal-input" placeholder="Enter here" >
    `, confirm_callback, reject_callback);
}

function confirm_box(message, confirm_callback, reject_callback) {
    start_modal(message, "Do you wish to continue?", confirm_callback, reject_callback);
}

function alert_box(message, confirm_callback) {
    let modal_confirm_button = document.getElementById("modal-button-confirm");
    let modal_body = document.getElementById("modal-body");

    modal_confirm_button.style.display = "none";
    modal_body.style.display = "none";

    start_modal(message, "", confirm_callback, () => {
        modal_confirm_button.style.display = "block";
        modal_body.style.display = "block";
    });
}

function reset_local_history() {
    confirm_box("Reset history?", () => {
        localStorage.clear();
        location.reload();
    }, () => {});
}

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
    prompt_box("Enter amount", "number", (amount) => {
        if (!amount) {
            alert_box("Please enter amount!", () => {});
            return;
        }
        
        prompt_box("Enter reason", "text", (reason) => {
            if (!reason) {
                alert_box("Please enter reason!", () => {});
                return;
            }
            
            amount = Number(amount);
            
            if (isNaN(amount)) {
                alert_box("Please enter a valid amount!", () => {});
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
        }, () => {});
    }, () => {});
}

function add_out_money() {
    prompt_box("Enter amount", "number", (amount) => {
        if (!amount) {
            alert_box("Please enter amount!", () => {});
            return;
        }

        prompt_box("Enter reason", "text", (reason) => {
            if (!reason) {
                alert_box("Please enter reason!", () => {});
                return;
            }

            amount = Number(amount);

            if (isNaN(amount)) {
                alert_box("Please enter a valid amount!", () => {});
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
        }, () => {});
    }, () => {});
}

function init() {
    load_local_history();
}

