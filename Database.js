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
            'SELECT SUM(calories) as totalCalories FROM logs WHERE dateOfEntry = ?',
            [today],
            (_, { rows }) => {
                if (rows.length > 0 && rows.item(0).totalCalories !== null) {
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
        // Ensure the food is logged in the foods table first
        tx.executeSql(
            'INSERT OR IGNORE INTO foods (foodName, calories) VALUES (?, ?)',
            [foodDescription, calories],
            () => {
                // Then insert into logs
                tx.executeSql(
                    'INSERT INTO logs (foodName, calories, dateOfEntry) VALUES (?, ?, ?)',
                    [foodDescription, caloriesToAdd, today],
                    () => {
                        callback(caloriesToAdd);
                    },
                    (_, error) => console.log('Error logging food', error)
                );
            },
            (_, error) => console.log('Error inserting food into foods table', error)
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

const deleteTodayLogs = (callback) => {
    const today = new Date().toISOString().split('T')[0];
    db.transaction(tx => {
        tx.executeSql(
            'DELETE FROM logs WHERE dateOfEntry = ?',
            [today],
            () => {
                console.log('Today\'s logs deleted successfully');
                callback && callback();
            },
            (_, error) => console.log('Error deleting today\'s logs', error)
        );
    });
};

const deleteAllLogs = (callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'DELETE FROM logs',
            [],
            () => {
                console.log('All logs deleted successfully');
                callback && callback();
            },
            (_, error) => console.log('Error deleting all logs', error)
        );
    });
};

const deleteAllFoods = (callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'DELETE FROM foods',
            [],
            () => {
                console.log('All foods deleted successfully');
                callback && callback();
            },
            (_, error) => console.log('Error deleting all foods', error)
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
        tx.executeSql('DROP TABLE IF EXISTS CalorieGoal;', [],
            () => console.log('CalorieGoal table dropped successfully'),
            (_, error) => console.log('Error dropping CalorieGoal table', error)
        );
    }, null, initDB); // Reinitialize the database after dropping tables
};

export { addFoodToLog, db, deleteAllFoods, deleteAllLogs, deleteTodayLogs, fetchCalorieGoal, fetchTodayCalories, fetchTodayLogItems, initDB, resetDB, setCalorieGoal };

