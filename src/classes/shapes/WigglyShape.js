import {Wiggly} from '../Wiggly.js';

/**
 * Base class for all WigglyShapes
 * @extends Wiggly
 */
class WigglyShape extends Wiggly {
    constructor(config) {
        super(config);
        this.x1 = config.x1;
        this.y1 = config.y1;
        this.x2 = config.x2;
        this.y2 = config.y2;
    }


    getColor() {
        return this.color;
    } 
}

export {WigglyShape}