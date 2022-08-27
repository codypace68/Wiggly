import {WigglyCircle} from "./classes/shapes/subClasses/WigglyCircle.js";
import {WigglyRectangle} from "./classes/shapes/subClasses/WigglyRectangle.js";

const configTypes = {
    'circle': WigglyCircle,
    'rectangle': WigglyRectangle
}

/**
 * Function to initialize appropriate class based on configuration object. See imprt for list of possible classes.
 * @param {object} config 
 * @returns {Class} Appropriate class for specified type.
 */
function Wiggle(config) {
    return new configTypes[config.type](config);
}

export {
    Wiggle
}