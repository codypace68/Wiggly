/**
 * Base class for all Wiggly objects
 */
class Wiggly {
    /**
     * 
     * @param {*} canvas 
     * @param {*} color 
     */
    constructor(config) {
        this.config = config;
        this.canvas = config.canvas;
        this.rect = this.canvas.getBoundingClientRect();
        if (this.canvas.id === '') this.canvas.id = Date.now();
        this.ctx = this.canvas.getContext('2d');
        this.color = config.color;
        this.border = "rgb(0,0,0)";
        this.frameFunction = config.callEachFrame || null;
        console.log(this.frameFunction);
    }


    // utility methods
    totalArray(arr) {
        let total = 0;
        for (let i = 0; i < arr.length; i++) {
            total += arr[i];
        }

        return total;
    }

    getRadions(degrees) {return (Math.PI/180)*degrees;}

    getXatDegree(degree, radius, xCenter) {
        // x(t) = r * cos(t) + j
        // y(t) = r * sin(t) + k
        // where (j,k) is center of circle, t is degrees, r is radius
        return radius * Math.cos(this.getRadions(degree)) + xCenter;
    }
    
    getYatDegree(degree, radius, yCenter) {
        // x(t) = r * cos(t) + j
        // y(t) = r * sin(t) + k
        // where (j,k) is center of circle, t is degrees, r is radius
        return radius * Math.sin(this.getRadions(degree)) + yCenter;
    }
    
}

export {Wiggly}