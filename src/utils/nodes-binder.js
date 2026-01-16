import { flatToNested, nestedToFlat } from "./file-utils";

// Constants for HTML attributes
const ATTR_NODE = "node";
const ATTR_DATA_FIELD = "node-data-field";
const ATTR_CHANGE_EVENT = "node-change-event";
const DEFAULT_DATA_FIELD = "value";
const DEFAULT_CHANGE_EVENT = "change";

/**
 * NodesBinder - Binds HTML form elements to a state object
 * Uses custom attributes to create two-way data binding
 */
export default class NodesBinder {
    #nodes = {};
    #listener = null;

    /**
     * @param {Object} options
     * @param {HTMLElement} options.root - The root element containing the nodes
     */
    constructor({ root } = {}) {
        if (root) {
            this.#init(root);
        }
    }

    /**
     * Initialize the binder with a root element
     * @param {HTMLElement} root
     */
    #init(root) {
        const nodesArr = root.querySelectorAll(`[${ATTR_NODE}]`);

        for (const node of nodesArr) {
            this.#setNodeListener(node);
        }

        this.#nodes = this.#buildNodes(nodesArr);
    }

    /**
     * Get the current state from all bound nodes
     * @returns {Object} Nested state object
     */
    getState() {
        return this.#buildState(this.#nodes);
    }

    /**
     * Update the state and trigger listeners
     * @param {Object} updatedState - Partial state to update
     */
    setState(updatedState) {
        const flatUpdatedState = nestedToFlat(updatedState);

        for (const [path, value] of Object.entries(flatUpdatedState)) {
            const node = this.#nodes[path];

            if (!node) {
                console.warn(`NodesBinder: Node not found for path "${path}"`);
                continue;
            }

            this.#setNodeState(node, value);
            this.#notifyListener(path, value);
        }
    }

    /**
     * Register a callback for state updates
     * @param {Function} listener - Callback function receiving { field, data }
     */
    onStateUpdate(listener) {
        this.#listener = listener;
    }

    /**
     * Notify the registered listener of a state change
     * @param {string} field - The field path that changed
     * @param {*} data - The new value
     */
    #notifyListener(field, data) {
        if (!this.#listener) {
            return;
        }
        this.#listener({ field, data });
    }

    /**
     * Get the current value from a node
     * @param {HTMLElement} node
     * @returns {*} The node's current value
     */
    #getNodeState(node) {
        const key = node.getAttribute(ATTR_DATA_FIELD) || DEFAULT_DATA_FIELD;
        return node[key];
    }

    /**
     * Set a value on a node
     * @param {HTMLElement} node
     * @param {*} data - The value to set
     */
    #setNodeState(node, data) {
        const key = node.getAttribute(ATTR_DATA_FIELD) || DEFAULT_DATA_FIELD;
        node[key] = data;
    }

    /**
     * Build the nested state object from all nodes
     * @param {Object} nodes - Flat nodes object
     * @returns {Object} Nested state object
     */
    #buildState(nodes) {
        const flatState = {};

        for (const [path, node] of Object.entries(nodes)) {
            flatState[path] = this.#getNodeState(node);
        }

        return flatToNested(flatState);
    }

    /**
     * Build a flat nodes object from a NodeList
     * @param {NodeList} nodesArray
     * @returns {Object} Flat nodes object keyed by path
     */
    #buildNodes(nodesArray) {
        const flatNodes = {};

        for (const node of nodesArray) {
            const statePath = node.getAttribute(ATTR_NODE);
            flatNodes[statePath] = node;
        }

        return flatNodes;
    }

    /**
     * Set up change listener on a node
     * @param {HTMLElement} node
     */
    #setNodeListener(node) {
        let eventType = node.getAttribute(ATTR_CHANGE_EVENT) || DEFAULT_CHANGE_EVENT;

        // Remove "on" prefix if present (e.g., "oninput" -> "input")
        if (eventType.startsWith("on")) {
            eventType = eventType.slice(2);
        }

        node.addEventListener(eventType, () => {
            const field = node.getAttribute(ATTR_NODE);
            const data = this.#getNodeState(node);
            this.#notifyListener(field, data);
        });
    }
}
