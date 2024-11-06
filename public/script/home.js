
"use strict";
(function () {

    window.addEventListener("load", init);
    function init() {
        id('signout-btn').addEventListener('click', removeCookie);
        let page = window.location.pathname;
        if (page == '/compose') {
            getUsers();
            id('compose-send-button').addEventListener('click', addEmail);
        } else if (page.includes('/detail')) {
            displayEmailDetail(page.substring(page.lastIndexOf('/') + 1, page.length));
        } else {
            id('delete-btn').addEventListener('click', deleteEmail);
            getBox(page);
        }
    }

    function removeCookie() {
        document.cookie = "full_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    async function getBox(box) {
        let userEmail = id('email').innerHTML;
        let res = await fetch(box, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail })
        });

        res = await res.json();

        if (res.length == 0) {
            let box = id('box');
            box.innerHTML = 'Empty';
            box.style.textAlign = 'center'
            box.style.marginTop = '50px';

        }
        else {
            displayBox(res, 1);
        }
    }

    function displayBox(res, currentPage) {
        displayEmails(res, currentPage);
        makePagination(res, currentPage);
    }

    function displayEmails(emails, currentPage) {
        let inbox = id('box-item-container');
        inbox.innerHTML = '';
        let boxItem = gen('div');
        let checkbox = gen('div');
        let input = gen('input');
        let span = gen('span');
        boxItem.id = 'box-title';
        checkbox.classList.add('checkbox');
        input.type = 'checkbox';
        input.id = 'checkAll';
        span.classList.add('checkmark');

        checkbox.appendChild(input);
        checkbox.appendChild(span);

        let name = gen('p');
        let subject = gen('p');
        let mailDate = gen('p');
        name.classList.add('mail-name');
        name.innerHTML ='Name';
        subject.classList.add('mail-subject');
        subject.innerHTML = 'Subject';
        mailDate.classList.add('mail-date');
        mailDate.innerHTML = 'Date';

        boxItem.appendChild(checkbox);
        boxItem.appendChild(name);
        boxItem.appendChild(subject);
        boxItem.appendChild(mailDate);

        inbox.appendChild(boxItem);
        id('checkAll').addEventListener('change', () => { qsa('.checkone').forEach(item => item.checked = id('checkAll').checked); });
        for (let index = (currentPage - 1) * 5; index < emails.length && index < currentPage * 5; index++) {
            const email = emails[index];

            let boxItem = gen('div');
            let checkbox = gen('div');
            let input = gen('input');
            let span = gen('span');
            boxItem.classList.add('box-item');
            boxItem.id = 'email' + (index % 5);
            boxItem.value = email.id;
            checkbox.classList.add('checkbox');
            checkbox.value = index;
            input.type = 'checkbox';
            input.classList.add('checkone');
            input.class = 'checkbox';
            span.classList.add('checkmark');

            checkbox.appendChild(input);
            checkbox.appendChild(span);

            let name = gen('p');
            let subject = gen('p');
            let mailDate = gen('p');
            name.classList.add('mail-name');
            name.innerHTML = email.full_name;
            subject.classList.add('mail-subject');
            subject.innerHTML = email.subject;
            subject.onclick = (function (emailId) {
                return function () {
                    window.location.href = '/detail/' + emailId;
                };
            })(email.id);
            mailDate.classList.add('mail-date');
            mailDate.innerHTML = (email.sent_at).substring(0, 10);

            boxItem.appendChild(checkbox);
            boxItem.appendChild(name);
            boxItem.appendChild(subject);
            boxItem.appendChild(mailDate);

            inbox.appendChild(boxItem);
        }
    }

    function makePagination(emails, currentPage) {
        let numberOfPage = Math.ceil(emails.length / 5);
        let paginationArea = id('pagination');
        paginationArea.innerHTML = '';

        for (let i = 1; i <= numberOfPage; i++) {
            let page = gen('div');
            if (i == currentPage) {
                page.id = 'current-page';
            }
            page.onclick = (function (pageNumber) {
                return function () {
                    displayBox(emails, pageNumber);
                };
            })(i);
            page.classList.add('page');
            page.innerHTML = i;

            paginationArea.appendChild(page);
        }
    }
    async function getUsers() {
        let select = id('compose-recipient');
        try {
            let response = await fetch('/users');
            let json = await response.text();
            let users = JSON.parse(json);
            users.forEach(user => {
                if (user.full_name != id('username').innerHTML) {
                    let option = gen('option');
                    option.value = user.email;
                    option.innerHTML = user.full_name + ': ' + user.email;
                    select.appendChild(option);
                }
            });
        } catch (error) {
            console.error(error);
        }
    }
    async function displayEmailDetail(emailId) {

        let res = await fetch('/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailId: emailId })
        });

        res = await res.json();
        let email = res[0];

        id('detail-subject').innerHTML = email.subject;
        id('detail-sender').innerHTML = email.sender_full_name != id('username').innerHTML ? email.sender_full_name + ' ( ' + email.sender_email + ')' : 'You';
        id('detail-receiver').innerHTML = email.receiver_full_name != id('username').innerHTML ? email.receiver_full_name + ' ( ' + email.receiver_email + ')' : 'You';
        id('detail-body').innerHTML = email.body;

    }
    async function addEmail() {
        let senderEmail = id('email').innerHTML;
        let receiverEmail = id('compose-recipient').value;
        if (receiverEmail == 'Choose here') {
            id('error').innerHTML = "Please choose recipient";
            id('success').innerHTML = '';
        }
        else {
            let subject = id('compose-subject').value;
            let body = id('compose-body').value;

            let res = await fetch('/addEmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderEmail: senderEmail,
                    receiverEmail: receiverEmail,
                    subject: subject,
                    body: body
                })
            })
            id('error').innerHTML = '';
            id('success').innerHTML = "Send email successfully!";
        }

    }
    async function deleteEmail() {
        console.log('delete');
        let checkboxs = qsa('input.checkone');
        let noChecked = true;
        console.log(window.location.pathname);
        let hideFrom = window.location.pathname == '/inbox' ? 'receiver_visible' : 'sender_visible';

        for (let index = 0; index < checkboxs.length; index++) {
            const checkbox = checkboxs[index];
            if (checkbox.checked) {
                noChecked = false;
                let email = id('email' + index);
                await fetch('/deleteEmail', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        hideFrom: hideFrom,
                        emailId: email.value
                    })
                });
            }
        }
        if (noChecked) {
            id('error').innerHTML = "Please choose emails to delete";
            id('success').innerHTML = '';
        } else {
            id('error').innerHTML = '';
            id('success').innerHTML = "Delete successfully";
            getBox(window.location.pathname);
        }

    }


    function id(id) {
        return document.getElementById(id);
    }
    function qsa(tagName) {
        return document.querySelectorAll(tagName);
    }
    function gen(tagName) {
        return document.createElement(tagName);
    }
})();
