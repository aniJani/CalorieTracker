import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('logs.db');

const initDB = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        foodName TEXT,
        calories INTEGER,
        dateOfEntry DATE
      );`,
            [],
            () => console.log('logs table created successfully'),
            (_, error) => console.log('Error creating logs table', error)
        );

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS foods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        foodName TEXT UNIQUE,
        calories INTEGER
      );`,
            [],
            () => console.log('foods table created successfully'),
            (_, error) => console.log('Error creating foods table', error)
        );

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Today (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        totalCalories INTEGER,
        date DATE
      );`,
            [],
            () => console.log('Today table created successfully'),
            (_, error) => console.log('Error creating Today table', error)
        );

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS CalorieGoal (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                goal INTEGER
            );`,
            [],
            () => console.log('CalorieGoal table created successfully'),
            (_, error) => console.log('Error creating CalorieGoal table', error)
        );
    });
};

const fetchCalorieGoal = (callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT goal FROM CalorieGoal',
            [],
            (_, { rows }) => {
                if (rows.length > 0) {
                    callback(rows.item(0).goal);
                } else {
                    callback(null);
                }
            },
            (_, error) => console.log('Error fetching calorie goal', error)
        );
    });
};

const setCalorieGoal = (goal, callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT OR REPLACE INTO CalorieGoal (id, goal) VALUES (1, ?)',
            [goal],
            callback,
            (_, error) => console.log('Error setting calorie goal', error)
        );
    });
};

const fetchTodayCalories = (callback) => {
    const today = new Date().toISOString().split('T')[0];
    db.transaction(tx => {
        tx.executeSql(
            'SELECT totalCalories FROM Today WHERE date = ?',
            [today],
            (_, { rows }) => {
                if (rows.length > 0) {
                    callback(rows.item(0).totalCalories);
                } else {
                    callback(0);
                }
            },
            (_, error) => console.log('Error fetching today\'s calories', error)
        );
    });
};

const addFoodToLog = (foodDescription, calories, servings, callback) => {
    const today = new Date().toISOString().split('T')[0];
    const caloriesToAdd = calories * servings;

    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO logs (foodName, calories, dateOfEntry) VALUES (?, ?, ?)',
            [foodDescription, caloriesToAdd, today],
            () => {
                tx.executeSql(
                    'INSERT OR REPLACE INTO Today (date, totalCalories) VALUES (?, COALESCE((SELECT totalCalories FROM Today WHERE date = ?), 0) + ?)',
                    [today, today, caloriesToAdd],
                    () => callback(caloriesToAdd),
                    (_, error) => console.log('Error updating today\'s calories', error)
                );
            },
            (_, error) => console.log('Error logging food', error)
        );
    });
};

const fetchTodayLogItems = (callback) => {
    const today = new Date().toISOString().split('T')[0];
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM logs WHERE dateOfEntry = ?',
            [today],
            (_, { rows }) => {
                let logItems = [];
                for (let i = 0; i < rows.length; i++) {
                    logItems.push(rows.item(i));
                }
                callback(logItems);
            },
            (_, error) => console.log('Error fetching today\'s log items', error)
        );
    });
};

const resetDB = () => {
    db.transaction(tx => {
        tx.executeSql('DROP TABLE IF EXISTS logs;', [],
            () => console.log('logs table dropped successfully'),
            (_, error) => console.log('Error dropping logs table', error)
        );
        tx.executeSql('DROP TABLE IF EXISTS foods;', [],
            () => console.log('foods table dropped successfully'),
            (_, error) => console.log('Error dropping foods table', error)
        );
        tx.executeSql('DROP TABLE IF EXISTS Today;', [],
            () => console.log('Today table dropped successfully'),
            (_, error) => console.log('Error dropping Today table', error)
        );
    }, null, initDB); // Reinitialize the database after dropping tables
};

export { addFoodToLog, db, fetchCalorieGoal, fetchTodayCalories, fetchTodayLogItems, initDB, resetDB, setCalorieGoal };

