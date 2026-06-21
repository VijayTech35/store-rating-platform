require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { pool, initSchema } = require('../config/database');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');

async function seed() {
  await initSchema();

  console.log('Clearing existing data...');
  await pool.query('DELETE FROM ratings');
  await pool.query('DELETE FROM stores');
  await pool.query('DELETE FROM users');

  console.log('Creating users...');
  const admin = await User.create({
    name: 'System Administrator Account',
    email: 'admin@test.com',
    password: 'Admin@123',
    address: '123 Admin Boulevard, Suite 100, San Francisco, CA 94102',
    role: 'admin',
  });
  const user1 = await User.create({
    name: 'John Doe Regular Customer',
    email: 'test@example.com',
    password: 'User@123',
    address: '456 Oak Avenue, Apt 7B, New York, NY 10001',
    role: 'user',
  });
  const owner1 = await User.create({
    name: 'Sarah Johnson Store Owner',
    email: 'owner@test.com',
    password: 'Owner@123',
    address: '789 Pine Road, Portland, OR 97201',
    role: 'store_owner',
  });
  const user2 = await User.create({
    name: 'Emily Chen Verified Buyer',
    email: 'emily@example.com',
    password: 'User@123',
    address: '321 Maple Drive, Chicago, IL 60601',
    role: 'user',
  });
  const owner2 = await User.create({
    name: 'Michael Torres Retail Manager',
    email: 'michael@test.com',
    password: 'Owner@123',
    address: '555 Cedar Lane, Austin, TX 73301',
    role: 'store_owner',
  });

  console.log('Creating stores...');
  const store1 = await Store.create({
    name: 'GreenLeaf Grocery',
    email: 'contact@greenleaf.com',
    address: '100 Market Street, Portland, OR 97201',
    owner_id: owner1.id,
  });
  const store2 = await Store.create({
    name: 'TechVibe Electronics',
    email: 'support@techvibe.com',
    address: '250 Innovation Drive, Austin, TX 73301',
    owner_id: owner2.id,
  });
  const store3 = await Store.create({
    name: 'Bella Italia Ristorante',
    email: 'info@bellaitalia.com',
    address: '78 Olive Grove, New York, NY 10012',
    owner_id: owner1.id,
  });
  const store4 = await Store.create({
    name: 'FitZone Gym & Wellness',
    email: 'hello@fitzone.com',
    address: '500 Health Blvd, San Francisco, CA 94102',
    owner_id: owner2.id,
  });
  const store5 = await Store.create({
    name: 'BookHaven Library',
    email: 'hello@bookhaven.com',
    address: '12 Reading Lane, Chicago, IL 60601',
    owner_id: owner1.id,
  });

  console.log('Creating ratings...');
  await Rating.upsert({ user_id: user1.id, store_id: store1.id, rating: 5 });
  await Rating.upsert({ user_id: user1.id, store_id: store2.id, rating: 4 });
  await Rating.upsert({ user_id: user1.id, store_id: store3.id, rating: 3 });
  await Rating.upsert({ user_id: user2.id, store_id: store1.id, rating: 4 });
  await Rating.upsert({ user_id: user2.id, store_id: store2.id, rating: 5 });
  await Rating.upsert({ user_id: user2.id, store_id: store4.id, rating: 5 });
  await Rating.upsert({ user_id: user2.id, store_id: store5.id, rating: 4 });
  await Rating.upsert({ user_id: user1.id, store_id: store4.id, rating: 2 });

  console.log('\n✅ Seed complete!');
  console.log(`  Users: 5 (1 admin, 2 users, 2 owners)`);
  console.log(`  Stores: 5`);
  console.log(`  Ratings: 8`);
  console.log(`\nLogin credentials:`);
  console.log(`  Admin:      admin@test.com / Admin@123`);
  console.log(`  User:       test@example.com / User@123`);
  console.log(`  User 2:     emily@example.com / User@123`);
  console.log(`  Owner:      owner@test.com / Owner@123`);
  console.log(`  Owner 2:    michael@test.com / Owner@123`);

  await pool.end();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
