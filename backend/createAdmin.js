
const db = require('./config/db');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function createAdmin() {
    try {
        rl.question('Enter administrator full name: ', async (name) => {
            rl.question('Enter administrator membership ID: ', async (membershipId) => {
                rl.question('Enter administrator password: ', async (password) => {

                    if (!name.trim() || !membershipId.trim() || password.length < 6) {
                        console.log('Please enter valid details. Password must be at least 6 characters.');
                        rl.close();
                        await db.end();
                        return;
                    }

                    const [existingUsers] = await db.query(
                        'SELECT id FROM users WHERE membership_id = ?',
                        [membershipId.trim()]
                    );

                    if (existingUsers.length > 0) {
                        console.log('This membership ID already exists.');
                        rl.close();
                        await db.end();
                        return;
                    }

                    const passwordHash = await bcrypt.hash(password, 10);

                    await db.query(
                        'INSERT INTO users (name, membership_id, role, password_hash) VALUES (?, ?, ?, ?)',
                        [name.trim(), membershipId.trim(), 'Admin', passwordHash]
                    );

                    console.log('Administrator account created successfully!');

                    rl.close();
                    await db.end();
                });
            });
        });

    } catch (error) {
        console.error('Error:', error.message);
        rl.close();
        await db.end();
    }
}

createAdmin();
