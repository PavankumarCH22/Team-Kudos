const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Kudos = require('../models/Kudos');
const Reaction = require('../models/Reaction');
const RefreshToken = require('../models/RefreshToken');
const ResetLog = require('../models/ResetLog');

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing database collections...');
    await User.deleteMany({});
    await Kudos.deleteMany({});
    await Reaction.deleteMany({});
    await RefreshToken.deleteMany({});
    await ResetLog.deleteMany({});

    console.log('🔑 Hashing default password...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Password123!', salt);

    console.log('👥 Creating Admin & 16 Demo Employees across all departments...');

    const usersToCreate = [
      // Admin
      {
        name: 'Sarah Connor (Admin)',
        email: 'admin@teamkudos.com',
        passwordHash,
        department: 'Engineering',
        role: 'admin',
        givingAllowance: 100,
        earnedPoints: 240,
        emailVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah_admin'
      },
      // Engineering
      {
        name: 'Alex Rivera',
        email: 'alex.rivera@teamkudos.com',
        passwordHash,
        department: 'Engineering',
        role: 'user',
        givingAllowance: 70,
        earnedPoints: 180,
        emailVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'
      },
      {
        name: 'Devon Vance',
        email: 'devon.vance@teamkudos.com',
        passwordHash,
        department: 'Engineering',
        role: 'user',
        givingAllowance: 90,
        earnedPoints: 110,
        emailVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devon'
      },
      {
        name: 'Elena Rostova',
        email: 'elena.rostova@teamkudos.com',
        passwordHash,
        department: 'Engineering',
        role: 'user',
        givingAllowance: 50,
        earnedPoints: 320,
        emailVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena'
      },
      {
        name: 'Marcus Chen',
        email: 'marcus.chen@teamkudos.com',
        passwordHash,
        department: 'Engineering',
        role: 'user',
        givingAllowance: 80,
        earnedPoints: 90,
        emailVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus'
      },

      // Design
      {
        name: 'Maya Lin',
        email: 'maya.lin@teamkudos.com',
        passwordHash,
        department: 'Design',
        role: 'user',
        givingAllowance: 60,
        earnedPoints: 210,
        emailVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya'
      },
      {
        name: 'Lucas Dupont',
        email: 'lucas.dupont@teamkudos.com',
        passwordHash,
        department: 'Design',
        role: 'user',
        givingAllowance: 100,
        earnedPoints: 140,
        emailVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lucas'
      },
      {
        name: 'Sophia Taylor',
        email: 'sophia.taylor@teamkudos.com',
        passwordHash,
        department: 'Design',
        role: 'user',
        givingAllowance: 40,
        earnedPoints: 260,
        emailVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia'
      },
      {
        name: 'Oliver Queen',
        email: 'oliver.queen@teamkudos.com',
        passwordHash,
        department: 'Design',
        role: 'user',
        givingAllowance: 90,
        earnedPoints: 70,
        emailVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=oliver'
      },

      // Marketing
      {
        name: 'Rachel Zane',
        email: 'rachel.zane@teamkudos.com',
        passwordHash,
        department: 'Marketing',
        role: 'user',
        givingAllowance: 80,
        earnedPoints: 190,
        emailVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rachel'
      },
      {
        name: 'James Wilson',
        email: 'james.wilson@teamkudos.com',
        passwordHash,
        department: 'Marketing',
        role: 'user',
        givingAllowance: 50,
        earnedPoints: 150,
        emailVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james'
      },
      {
        name: 'Chloe Bennett',
        email: 'chloe.bennett@teamkudos.com',
        passwordHash,
        department: 'Marketing',
        role: 'user',
        givingAllowance: 100,
        earnedPoints: 80,
        emailVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chloe'
      },
      {
        name: 'Ethan Hunt',
        email: 'ethan.hunt@teamkudos.com',
        passwordHash,
        department: 'Marketing',
        role: 'user',
        givingAllowance: 70,
        earnedPoints: 120,
        emailVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ethan'
      },

      // Sales
      {
        name: 'Daniel Blake',
        email: 'daniel.blake@teamkudos.com',
        passwordHash,
        department: 'Sales',
        role: 'user',
        givingAllowance: 30,
        earnedPoints: 290,
        emailVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=daniel'
      },
      {
        name: 'Hannah Abbott',
        email: 'hannah.abbott@teamkudos.com',
        passwordHash,
        department: 'Sales',
        role: 'user',
        givingAllowance: 90,
        earnedPoints: 160,
        emailVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hannah'
      },
      {
        name: 'Gabriel Macht',
        email: 'gabriel.macht@teamkudos.com',
        passwordHash,
        department: 'Sales',
        role: 'user',
        givingAllowance: 60,
        earnedPoints: 220,
        emailVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gabriel'
      }
    ];

    const createdUsers = await User.insertMany(usersToCreate);
    console.log(`✅ Created ${createdUsers.length} users successfully.`);

    const findUser = (email) => createdUsers.find((u) => u.email === email);

    console.log('🎉 Creating sample Kudos transactions...');
    const sampleKudos = [
      {
        sender: findUser('alex.rivera@teamkudos.com')._id,
        recipient: findUser('elena.rostova@teamkudos.com')._id,
        points: 50,
        message: 'Elena architected the new database migration flawlessly! Zero downtime during the peak deployment windows.',
        tags: ['#Innovation', '#Teamwork'],
        reactionsCount: { plusOne: 3, clap: 5, fire: 7 }
      },
      {
        sender: findUser('maya.lin@teamkudos.com')._id,
        recipient: findUser('sophia.taylor@teamkudos.com')._id,
        points: 20,
        message: 'Sophia created stunning new UI components for our design system. The accessibility and dark mode support are top notch!',
        tags: ['#Innovation'],
        reactionsCount: { plusOne: 2, clap: 4, fire: 2 }
      },
      {
        sender: findUser('daniel.blake@teamkudos.com')._id,
        recipient: findUser('rachel.zane@teamkudos.com')._id,
        points: 50,
        message: 'Rachel delivered an outstanding product launch campaign. We beat Q3 sales projections by 35%!',
        tags: ['#CustomerObsession', '#Teamwork'],
        reactionsCount: { plusOne: 6, clap: 8, fire: 10 }
      },
      {
        sender: findUser('devon.vance@teamkudos.com')._id,
        recipient: findUser('alex.rivera@teamkudos.com')._id,
        points: 20,
        message: 'Huge thanks to Alex for pairing with me on the authentication refresh token rotation bug last Friday night.',
        tags: ['#Teamwork'],
        reactionsCount: { plusOne: 4, clap: 6, fire: 3 }
      },
      {
        sender: findUser('lucas.dupont@teamkudos.com')._id,
        recipient: findUser('maya.lin@teamkudos.com')._id,
        points: 50,
        message: 'Maya led the customer feedback workshop with immense empathy and translated user pain points into seamless workflows.',
        tags: ['#CustomerObsession'],
        reactionsCount: { plusOne: 5, clap: 7, fire: 4 }
      },
      {
        sender: findUser('hannah.abbott@teamkudos.com')._id,
        recipient: findUser('gabriel.macht@teamkudos.com')._id,
        points: 20,
        message: 'Kudos to Gabriel for closing the enterprise client renewal ahead of schedule!',
        tags: ['#CustomerObsession'],
        reactionsCount: { plusOne: 2, clap: 5, fire: 6 }
      },
      {
        sender: findUser('admin@teamkudos.com')._id,
        recipient: findUser('daniel.blake@teamkudos.com')._id,
        points: 50,
        message: 'Daniel consistently demonstrates leadership across departments. Thank you for championing our core company values!',
        tags: ['#Teamwork', '#Innovation', '#CustomerObsession'],
        reactionsCount: { plusOne: 8, clap: 12, fire: 9 }
      }
    ];

    const createdKudos = await Kudos.insertMany(sampleKudos);
    console.log(`✅ Inserted ${createdKudos.length} sample kudos posts.`);

    console.log('❤️ Inserting sample emoji reactions...');
    const reactionsToCreate = [];
    createdKudos.forEach((kudos) => {
      // Add a couple reactions from random users
      reactionsToCreate.push({
        kudos: kudos._id,
        user: createdUsers[0]._id,
        emoji: '👏'
      });
      reactionsToCreate.push({
        kudos: kudos._id,
        user: createdUsers[1]._id,
        emoji: '🔥'
      });
    });

    await Reaction.insertMany(reactionsToCreate);
    console.log(`✅ Created ${reactionsToCreate.length} sample reactions.`);

    console.log('\n======================================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('Demo Admin Credential:');
    console.log('  Email:    admin@teamkudos.com');
    console.log('  Password: Password123!');
    console.log('Demo Employee Credentials:');
    console.log('  Email:    alex.rivera@teamkudos.com');
    console.log('  Password: Password123!');
    console.log('  Email:    maya.lin@teamkudos.com');
    console.log('  Password: Password123!');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
