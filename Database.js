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
    });
};

export { initDB };

