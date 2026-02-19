require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/payout-management';
  await mongoose.connect(uri);

  const users = [
    { email: 'ops@demo.com', password: 'ops123', role: 'OPS' },
    { email: 'finance@demo.com', password: 'fin123', role: 'FINANCE' },
  ];

  for (const user of users) {
    const existing = await User.findOne({ email: user.email });
    if (existing) {
      console.log(`Skipping (exists): ${user.email}`);
      continue;
    }
    await new User(user).save();
    console.log(`Created: ${user.email}`);
  }

  await mongoose.disconnect();
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
