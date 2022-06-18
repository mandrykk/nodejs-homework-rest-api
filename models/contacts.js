const fs = require('fs/promises');
const path = require('path');

const contactsPath = path.join(__dirname, "/contacts.json");

async function listContacts() {
    try {
        const data = await fs.readFile(contactsPath);
        return JSON.parse(data);
    } catch (error) {
        console.error(error)
    }
}

async function getContactById(contactId) {
    try {
        const data = await listContacts();
        const contacts = data.find((contact) => contact.id === contactId);
        if (!contacts) {
            return null;
        }
        return contacts;
    } catch (error) {
        console.error(error);
    }
}

async function removeContact(contactId) {
    try {
        const data = await listContacts();
        const newData = data.filter((contact) => contact.id !== contactId);
        await fs.writeFile(contactsPath, JSON.stringify(newData));
        const newList = await listContacts();
        return newList;
    } catch (error) {
        console.error(error);
    }
}

async function addContact(name, email, phone) {
    try {
        const data = await listContacts();
        const newId = `${data.length + 1}`;
        data.push({ id: newId, name, email, phone });
        await fs.writeFile(contactsPath, JSON.stringify(data));
        const newData = await listContacts();
        return newData;
    } catch (error) {
        console.error(error);
    }
}

const updateContact = async (contactId, body) => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((item) => item.id === contactId);
    if (index === -1) {
      return null;
    }
    contacts[index] = { ...body, contactId };
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
