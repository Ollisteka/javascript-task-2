'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = new Map();

class PhoneBookEntry {
    constructor(phone, name, email, queryPhone) {
        this.phone = phone; // +7 (555) 666-77-88
        this.name = name;
        this.email = email;
        this.queryPhone = queryPhone; // 5556667788
    }

    toString() {
        let str = `${this.queryPhone}, ${this.name}, ${this.phone}`;
        if (this.email) {
            str += `, ${this.email}`;
        }

        return str;
    }
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    const correctPhone = formatPhone(phone);
    if (!correctPhone || !isNameCorrect(name) || !isEmailCorrect(email) || phoneBook.has(phone)) {
        return false;
    }

    phoneBook.set(phone, new PhoneBookEntry(correctPhone, name, email));

    return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    const correctPhone = /^\d{3}\d{3}\d{2}\d{2}$/g;
    if (!isNameCorrect(name) || !isEmailCorrect(email) ||
        !isString(phone) || !correctPhone.test(phone)) {
        return false;
    }

    let entry = phoneBook.get(phone);
    if (!entry) {
        return false;
    }

    entry.name = name;
    entry.email = email;

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const found = find(query);
    found.map(entry => phoneBook.delete(extractPhone(entry)));

    return found.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (!isString(query) || query === '') {
        return [];
    }

    let entries = getAllEntries();
    entries.sort();
    if (query === '*') {
        return entries.map(entry => entry.slice(11));
    }

    return entries.filter(entry => entry.includes(query)).map(entry => entry.slice(11));
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует

    let split = csv.split('\n');
    let total = 0;
    split.forEach(line => {
        let [name, phone, email] = line.split(';');
        if (addOrUpdate(phone, name, email)) {
            total++;
        }
    });

    return total;
}

function addOrUpdate(phone, name, email) {
    return add(phone, name, email) || update(phone, name, email);
}


function isTypeOf(obj, type) {
    return typeof obj === type;
}

function isString(obj) {
    return isTypeOf(obj, 'string');
}

function formatPhone(phone) {
    if (!isString(phone)) {
        return null;
    }

    const correctPhone = /^(\d{3})(\d{3})(\d{2})(\d{2})$/; // 5556667788
    const match = phone.match(correctPhone);
    if (!match) {
        return null;
    }

    return `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`; // +7 (555) 666-77-88
}

function isNameCorrect(name) {
    return isString(name) && name !== '';
}

function isEmailCorrect(email) {
    return isTypeOf(email, 'undefined') || isString(email);
    // «Электронную почту» можно стереть (не передав последний параметр)
    // А пустой строкой можно стереть?? Проверить
    // Добавить регвыр .@.\..???
}

function getAllEntries() {
    return Array.from(phoneBook.values()).map((entry) => entry.toString());
}

function extractPhone(str) {
    const regexp = /.*, \+7 \((\d{3})\) (\d{3})-(\d{2})-(\d{2}),*.*/;
    const match = str.match(regexp);

    return `${match[1]}${match[2]}${match[3]}${match[4]}`;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
