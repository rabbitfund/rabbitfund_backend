const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcryptjs");

const createRandomUsers = (n) => {
  const users = [];
  const userIds = [];
  for (let i = 0; i < n; i++) {
    const firstname = faker.person.firstName();
    const lastname = faker.person.lastName();
    const userId = new mongoose.Types.ObjectId().toString()
    const user = {
      _id: userId,
      user_name: `${firstname} ${lastname}`,
      user_email: faker.internet.email({ firstName: firstname, lastName: lastname }),
      user_hash_pwd: bcrypt.hashSync("password", 12),
      user_roles: [0],
      login_method: [0],
      oauth_google_id: "",
      user_create_date: faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2023-01-01T00:00:00.000Z' }).toJSON(),
      user_update_date: faker.date.between({ from: '2023-04-01T00:00:00.000Z', to: '2023-05-28T00:00:00.000Z' }).toJSON(),
      user_cover: "cover URL",
      user_phone: faker.phone.number("09##-###-###"),
      user_intro: "user intro",
      user_website: "website",
      user_interests: []
    }
    users.push(user);
    userIds.push(userId);
  };
  return {
    users: users,
    userIds: userIds
  };
};

const createRandomProposers = (userIds) => {
  const proposers = [];
  for (const userId of userIds) {
    const companyName = faker.company.name();
    const proposerId = new mongoose.Types.ObjectId().toString();
    const proposer = {
      id_: proposerId,
      proposer_name: companyName,
      proposer_create: userId,
      proposer_group: [],
      proposer_create_date: faker.date.between({ from: '2023-01-02T00:00:00.000Z', to: '2023-03-31T00:00:00.000Z' }).toJSON(),
      proposer_update_date: faker.date.between({ from: '2023-04-01T00:00:00.000Z', to: '2023-06-30T00:00:00.000Z' }).toJSON(),
      proposer_email: faker.internet.email({ firstName: companyName }),
      proposer_phone: faker.phone.number("09##-###-###"),
      proposer_tax_id: faker.string.numeric(8),
      proposer_intro: "proposer intro",
      proposer_website: "proposer website",
      proposer_project: [],
      proposer_like: [],
    }
    proposers.push(proposer);
  }
  return {
    proposers: proposers
  }
}

module.exports = {
  createRandomUsers,
  createRandomProposers
}

// const randomUsers = createRandomUsers(10);
// console.log(randomUsers.users);
// console.log(createRandomProposers(randomUsers.userIds.splice(0, 3)));

