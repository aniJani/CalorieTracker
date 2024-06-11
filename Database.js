import * as SQLite from 'expo-sqlite';

// Open the database
const dbPromise = SQLite.openDatabaseAsync('logs.db');

export const initDB = async () => {
    try {
        const db = await dbPromise;
        await db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        foodName TEXT,
        calories INTEGER,
        dateOfEntry DATE
      );
      CREATE TABLE IF NOT EXISTS foods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        foodName TEXT UNIQUE,
        calories INTEGER
      );
      CREATE TABLE IF NOT EXISTS CalorieGoal (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        goal INTEGER
      );
    `);
        console.log('Tables created successfully');
    } catch (error) {
        console.error('Error initializing database', error);
    }
};

export const fetchCalorieGoal = async (callback) => {
    try {
        const db = await dbPromise;
        const result = await db.getFirstAsync('SELECT goal FROM CalorieGoal');
        callback(result ? result.goal : null);
    } catch (error) {
        console.error('Error fetching calorie goal', error);
    }
};

export const setCalorieGoal = async (goal, callback) => {
    try {
        const db = await dbPromise;
        await db.runAsync('INSERT OR REPLACE INTO CalorieGoal (id, goal) VALUES (1, ?)', [goal]);
        callback();
    } catch (error) {
        console.error('Error setting calorie goal', error);
    }
};

export const fetchTodayCalories = async (callback) => {
    const today = new Date().toISOString().split('T')[0];
    try {
        const db = await dbPromise;
        const result = await db.getFirstAsync('SELECT SUM(calories) as totalCalories FROM logs WHERE dateOfEntry = ?', [today]);
        callback(result && result.totalCalories ? result.totalCalories : 0);
    } catch (error) {
        console.error('Error fetching today\'s calories', error);
    }
};

export const addFoodToLog = async (foodDescription, calories, servings, callback) => {
    const today = new Date().toISOString().split('T')[0];
    const caloriesToAdd = calories * servings;

    try {
        const db = await dbPromise;
        await db.withTransactionAsync(async () => {
            await db.runAsync('INSERT OR IGNORE INTO foods (foodName, calories) VALUES (?, ?)', [foodDescription, calories]);
            await db.runAsync('INSERT INTO logs (foodName, calories, dateOfEntry) VALUES (?, ?, ?)', [foodDescription, caloriesToAdd, today]);
            callback(caloriesToAdd);
        });
    } catch (error) {
        console.error('Error logging food', error);
    }
};


export const fetchTodayLogItems = async (callback) => {
    const today = new Date().toISOString().split('T')[0];
    try {
        const db = await dbPromise;
        const result = await db.getAllAsync('SELECT * FROM logs WHERE dateOfEntry = ?', [today]);
        callback(result);
    } catch (error) {
        console.error('Error fetching today\'s log items', error);
    }
};

export const deleteTodayLogs = async (callback) => {
    const today = new Date().toISOString().split('T')[0];
    try {
        const db = await dbPromise;
        await db.runAsync('DELETE FROM logs WHERE dateOfEntry = ?', [today]);
        console.log('Today\'s logs deleted successfully');
        callback && callback();
    } catch (error) {
        console.error('Error deleting today\'s logs', error);
    }
};

export const deleteAllLogs = async (callback) => {
    try {
        const db = await dbPromise;
        await db.runAsync('DELETE FROM logs');
        console.log('All logs deleted successfully');
        callback && callback();
    } catch (error) {
        console.error('Error deleting all logs', error);
    }
};

export const deleteAllFoods = async (callback) => {
    try {
        const db = await dbPromise;
        await db.runAsync('DELETE FROM foods');
        console.log('All foods deleted successfully');
        callback && callback();
    } catch (error) {
        console.error('Error deleting all foods', error);
    }
};

export const deleteLogById = async (logId, callback) => {
    try {
        const db = await dbPromise;
        await db.runAsync('DELETE FROM logs WHERE id = ?', [logId]);
        console.log(`Log with id ${logId} deleted successfully`);
        callback && callback();
    } catch (error) {
        console.error(`Error deleting log with id ${logId}`, error);
    }
};

export const resetDB = async () => {
    try {
        const db = await dbPromise;
        await db.execAsync(`
      DROP TABLE IF EXISTS logs;
      DROP TABLE IF EXISTS foods;
      DROP TABLE IF EXISTS CalorieGoal;
    `);
        await initDB(); // Reinitialize the database after dropping tables
    } catch (error) {
        console.error('Error resetting database', error);
    }
};

export const fetchHistory = async (callback) => {
    try {
        const db = await dbPromise;
        const result = await db.getAllAsync('SELECT dateOfEntry as date, SUM(calories) as totalCalories FROM logs GROUP BY dateOfEntry ORDER BY dateOfEntry DESC');
        callback(result);
    } catch (error) {
        console.error('Error fetching history data', error);
    }
};
