const testUser = require('./testUser.json');
const testOtherUser = require('./testOtherUser.json');
const testAdmin = require('./testAdmin.json');
const testUserUnsetUsername = require('./testUserUnsetUsername.json');
/*
The reason for a user with content and a user without is rate limiting.
With the database having just been seeded, a user with e.g. existing posts
can't create a new one without waiting about ten seconds.
*/
module.exports = [
  testUser,
  testOtherUser,
  testAdmin,
  testUserUnsetUsername,
];
