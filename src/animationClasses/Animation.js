/**
 * Main class for animation helper
 */
class Animation {
    constructor(config) {
        if (config == undefined) config = {};
        this.animationObjects = config.objectToAnimate || [];

        // used to run animation loop
        this.delay = 1000 / 60; // 60fps
        this.frame = 0;
        this.time = null;
    }

    addObjectToAnimate(obj) {
        this.animationObjects.push(obj);
    }

    startAnimations() {
        this.loop(0);
    }

    loop(timestamp) {
        // animate at 60fps
        if (this.time === null) this.time = timestamp;

        let seg = Math.floor((timestamp - this.time) / this.delay);

        if (seg > this.frame) {
            let canvasIds = [];
            this.frame = seg;

            this.animationObjects.forEach(object => {
                if (canvasIds.indexOf(object.canvas.id) === -1) {
                    canvasIds.push(object.canvas.id);
                    object.ctx.clearRect(0,0,object.canvas.width, object.canvas.height);
                }
                object.draw();
            })
        }


        window.requestAnimationFrame((timestamp) => {
            this.loop(timestamp);            
        })
}
}

export {Animation}