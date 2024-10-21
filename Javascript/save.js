export const saveData = {
    save: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`Data saved successfully with key: ${key}`);
            return true;
        } catch (error) {
            console.error(`Error saving data: ${error}`);
            return false;
        }
    },

    load: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error loading data: ${error}`);
            return null;
        }
    },

    delete: function(key) {
        try {
            localStorage.removeItem(key);
            console.log(`Data with key ${key} deleted successfully`);
            return true;
        } catch (error) {
            console.error(`Error deleting data: ${error}`);
            return false;
        }
    }
};