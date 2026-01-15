/**
 * Check if a value is a plain object (not array, null, or other types)
 * @param {*} value
 * @returns {boolean}
 */
function isPlainObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}

/**
 * Convert a nested object to a flat object with dot notation keys
 * @param {Object} object - Nested object
 * @returns {Object} Flat object with dot notation keys
 * @example
 * nestedToFlat({ a: { b: 1 } }) // { "a.b": 1 }
 */
export function nestedToFlat(object) {
    const result = {};

    for (const [key, value] of Object.entries(object)) {
        if (isPlainObject(value)) {
            const nested = nestedToFlat(value);

            for (const [nestedKey, nestedValue] of Object.entries(nested)) {
                result[`${key}.${nestedKey}`] = nestedValue;
            }
        } else {
            result[key] = value;
        }
    }

    return result;
}

/**
 * Convert a flat object with dot notation keys to a nested object
 * @param {Object} object - Flat object with dot notation keys
 * @returns {Object} Nested object
 * @example
 * flatToNested({ "a.b": 1 }) // { a: { b: 1 } }
 */
export function flatToNested(object) {
    const result = {};

    for (const [path, value] of Object.entries(object)) {
        const keys = path.split(".");
        const firstKey = keys.shift();
        const remainingPath = keys.join(".");

        if (remainingPath.length) {
            const nestedObject = result[firstKey] || {};
            nestedObject[remainingPath] = value;
            result[firstKey] = flatToNested(nestedObject);
        } else {
            result[firstKey] = value;
        }
    }

    return result;
}

/**
 * Read a file and return its content as a data URL
 * @param {File} file - File object to read
 * @returns {Promise<string>} Promise resolving to the data URL
 */
export function getSrcFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = event => {
            resolve(event.target.result);
        };

        reader.onerror = () => {
            reject(new Error("Failed to read file"));
        };

        reader.readAsDataURL(file);
    });
}
