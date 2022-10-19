import { WigglyShape } from "../WigglyShape.js";

/**
 * Class for WigglyCircle object
 * @extends WigglyShape
 */
class WigglyCircle extends WigglyShape {
    /**
    * constructor of WigglyCircle class exposed by {@link init}
    * @param {Object} config
    * @param {Integer} config.x1 used as center X point of circle
    * @param {Integer} config.y1 used as center Y point of circle
    * @param {HTMLElement} config.canvas HTML canvas element to render WigglyCircle on
    * @param {Integer} [config.radius=20] Radius of the circle. Note that the resulting shape will be larger as each "wiggle" will be render on the outside of the circle.
    * @param {String}  [config.text=""] Text value to render in center of WigglyCircle when <i>config.drawTextShape == true </i>.
    * @param {Boolean} [config.drawWiggleShape=true] <b>DevTool:</b> determines whether to render to "wiggles" on the edge of the circle
    * @param {Boolean} [config.drawScallopShape=false] <b>DevTool:</b> determines whether to render the base scallop shape that wiggles are based on.
    * @param {Boolean} [config.drawCircleShape=false] <b>DevTool:</b> determines whether to render to circle which "wiggles" are draw around.
    * @param {Boolean} [config.drawTextShape=false] <b>DevTool:</b> determines whether to render <i>config.text</i> value in center of WiggleCircle.
    * @param {Boolean} [config.drawSegmentBoundaryShape=false] <b>DevTool:</b> determines whether to render lines segmenting circle at each "wiggle" boundary.
    */
    constructor(config) {
        super(config);
        
        // decide which shapes should be drawn
        this.drawScallopShape = config.drawScallopShape || false;
        this.drawWiggleShape = config.drawFunkyShape || true;
        this.drawCircleShape = config.drawCircleShape || false;
        this.drawTextShape = config.drawTextShape || false;
        this.drawSegmentBoundaryShape = config.drawSegmentBoundaryShape || false;

        // display options
        this.text = config.text || "";       
        this.shadowBlur = config.shadowBlur || "";
        this.wiggleSegments = config.wiggleSegments || 5;
        this.shadowColor = config.shadowColor || "black";
        this.radius = config.radius || 20;


        // these parameters define how the wiggle will turn and the segments
        this.degreeRotation = 0;
        this.wiggle.numSegments = this.wiggleSegments;// wiggle will have between 7 and 12 segments

        this.wiggle.setMaxMinRadial();
        this.wiggle.createSegements();
    }

    /**
     * Draws all specified components onto the configured canvas.
     */
    draw() {
        if (this.drawScallopShape) this.drawScallop();
        if (this.drawWiggleShape) this.drawWiggle();
        if (this.drawCircleShape) this.drawCircle();
        if (this.drawSegmentBoundaryShape) this.drawSegmentBoundries();
        if (this.drawTextShape) this.drawText();
    }

    /**
     * Draws specified text into the center of WigglyCircle.
     */
    drawText() {
        this.ctx.font = '20px serif';
        this.ctx.textAlign = 'center';
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(this.text, this.x1, this.y1);
    }

    drawCircle() {
        this.ctx.beginPath();
        this.ctx.shadowColor = '';
        this.ctx.shadowBlur = 0;
        this.ctx.arc(this.x1,this.y1,this.radius,0,this.getRadions(360),false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    drawWiggle() {    
        this.degreeRotation += .2;
        let startDeg = 0 + this.degreeRotation;
        let endDeg = 0 + this.degreeRotation;
        this.ctx.beginPath();
        this.ctx.shadowBlur = this.shadowBlur;
        this.ctx.shadowColor = this.shadowColor;

        for (let i = 0; i < this.wiggle.numSegments; i++) {
            let curSegment = this.wiggle.segments[i];
            let nextSegment = i + 1 >= this.wiggle.numSegments ? this.wiggle.segments[0] : this.wiggle.segments[i + 1];            
            
            startDeg = startDeg + curSegment.curSegmentSize;
            endDeg = startDeg + nextSegment.curSegmentSize;

            let x = this.getXatDegree(startDeg, this.radius, this.x1);
            let y = this.getYatDegree(startDeg, this.radius, this.y1);
        
            
            if (i === 0) this.ctx.moveTo(x, y);
            this.ctx.bezierCurveTo(
                this.getXatDegree(startDeg + curSegment.curCP1Offset, this.radius + curSegment.curRadialOffset, this.x1), 
                this.getYatDegree(startDeg + curSegment.curCP1Offset, this.radius + curSegment.curRadialOffset, this.y1), 
                this.getXatDegree(endDeg - curSegment.curCP2Offset, this.radius + curSegment.curRadialOffset, this.x1), 
                this.getYatDegree(endDeg - curSegment.curCP2Offset, this.radius + curSegment.curRadialOffset, this.y1), 
                this.getXatDegree(endDeg, this.radius, this.x1), 
                this.getYatDegree(endDeg, this.radius, this.y1)
            )



            // control point 1 move left to right
            curSegment.curCP1Offset = curSegment.CPdirection === 'right' ?  curSegment.curCP1Offset + this.wiggle.CPIncrement : curSegment.curCP1Offset - this.wiggle.CPIncrement;

            if (curSegment.curCP1Offset >= this.wiggle.maxCPOffset) {
                curSegment.CPdirection = 'left';
                curSegment.curCP1Offset -= this.wiggle.CPIncrement;
            }

            if (curSegment.curCP1Offset <= this.wiggle.minCPOffset) {
                curSegment.CPdirection = 'right';
                curSegment.curCP1Offset += this.wiggle.CPIncrement;
            }

            // control point2 move left and right
            curSegment.curCP2Offset = curSegment.CPdirection === 'left' ?  curSegment.curCP2Offset + this.wiggle.CPIncrement : curSegment.curCP2Offset - this.wiggle.CPIncrement;

            if (curSegment.curCP2Offset >= this.wiggle.maxCPOffset) {
                curSegment.CPdirection = 'right';
                curSegment.curCP2Offset -= this.wiggle.CPIncrement;
            }

            if (curSegment.curCP2Offset <= this.wiggle.minCPOffset) {
                curSegment.CPdirection = 'left';
                curSegment.curCP2Offset += this.wiggle.CPIncrement;
            }

            // move control points away from and back towards the center of the circle
            curSegment.curRadialOffset = curSegment.radialDirection === 'up' ? curSegment.curRadialOffset + this.wiggle.radialIncrement: curSegment.curRadialOffset - this.wiggle.radialIncrement;
        
            if (curSegment.curRadialOffset >= this.wiggle.maxRadialOffset) {
                curSegment.radialDirection = 'down';
                curSegment.curRadialOffset -= this.wiggle.radialIncrement;
            }

            if (curSegment.curRadialOffset <= this.wiggle.minRadialOffset) {
                curSegment.radialDirection = 'up';
                curSegment.curRadialOffset += this.wiggle.radialIncrement;
            }
        }

        // this.wiggle.randomizeSegments();
        this.ctx.closePath();

        this.ctx.fillStyle = this.color;
        this.ctx.fill();

        this.ctx.strokeStyle = this.border;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

    }

    drawSegmentBoundries() {
        this.degreeRotation += 1;
        let startDeg = 0 + this.degreeRotation;
        let endDeg = 0 + this.degreeRotation;

        for (let i = -1; i < this.wiggle.numSegments - 1; i++) {
            startDeg = i === -1 ? startDeg : startDeg + this.wiggle.segments[i].curSegmentSize;
            endDeg = i === -1 ? this.wiggle.segments[0].curSegmentSize + this.degreeRotation : endDeg + this.wiggle.segments[i + 1].curSegmentSize;

            let x = this.getXatDegree(startDeg, this.radius, this.x1);
            let y = this.getYatDegree(startDeg, this.radius, this.y1);

            this.ctx.moveTo(this.x1, this.y1);
            this.ctx.lineTo(
                this.getXatDegree(endDeg, this.radius + 50, this.x1),
                this.getYatDegree(endDeg, this.radius + 50, this.y1)
            )
            this.ctx.stroke();
        }
    }

    drawScallop() {
        for (let i = 0; i< 360 ;i = i + 30) {
            let x = this.getXatDegree(i, this.radius, this.x1);
            let y = this.getYatDegree(i, this.radius, this.y1);
        
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.bezierCurveTo(
                this.getXatDegree(i, this.radius + 20, this.x1), 
                this.getYatDegree(i, this.radius + 20, this.y1), 
                this.getXatDegree(i + 30, this.radius + 20, this.x1), 
                this.getYatDegree(i + 30, this.radius + 20, this.y1), 
                this.getXatDegree(i + 30, this.radius, this.x1), 
                this.getYatDegree(i + 30, this.radius, this.y1)
            )
            this.ctx.stroke();
        }
    }

        // wiggle definition
        wiggle = {
            segments: [],
            numSegments: 0,
            minRadialOffset: null,
            maxRadialOffset: null,
            //maxCPOffset: 10000,
            minCPOffset: 0,   
            CPIncrement: .2, 
            radialIncrement: .2,
            setMaxMinRadial: () => {
                this.wiggle.minRadialOffset = this.config.radius - (this.config.radius * .2);
                this.wiggle.maxRadialOffset = this.config.radius * 1.2;
                this.wiggle.radialIncrement = (this.wiggle.maxRadialOffset - this.wiggle.minRadialOffset) * .015;
            },
            randomizeSegments: (amount) => {
                let amountToMove = amount;
    
                let totalRadom = 0;
    
                this.wiggle.segments.forEach(segment => {
                    let amountAdded = Math.random() > .5 ? .1 : -.1;
                    // add or substract 2 from each segment
                    segment.curSegmentSize += amountAdded;
                    totalRadom +=amountAdded;
                })
    
                console.log('totalRandom', totalRadom);
            },
            createSegements: () => {
                // randomize width of segments on initialization
                let numArray = [];
                let totalOfRandom = 0;
                let total = 0;
    
                // sudo-code for this found below
                // https://stackoverflow.com/questions/19277973/generate-4-random-numbers-that-add-to-a-certain-value-in-javascript
    
                // start by getting an array of random numbers
                for (let i = 0; i < this.wiggle.numSegments; i++) {
                    let randInt = Math.round(Math.random() * 10 + 10);
    
                    numArray.push(randInt)
                }
    
    
                // then we get the total of these random numbers
                totalOfRandom = this.totalArray(numArray);
    
                
    
                // finally we normalize the array based off total we desire (here it's 360 degrees)
                for (let i = 0; i < numArray.length; i++) {
                    numArray[i] = Math.round(numArray[i] * (360 / totalOfRandom));
                }
    
                
                // Finally we need to ensure the randomize ints total to 360 as we can miss a degree or two due to rounding
                total = this.totalArray(numArray);
    
                if (total !== 360) {
                    let tempTotal = 0;
                    for (let i = 0; i < numArray.length; i++) {
                        if (i + 1 == numArray.length) {
                            numArray[i] = 360 - tempTotal;
                        } else {
                            tempTotal += numArray[i];
                        }
                    }
                }
    
                
                numArray.forEach(segment => {
                    const randInt1 = Math.round(Math.random() * 10) + 5; // between 5 and 10
                    const randInt2 = Math.round(Math.random() * 10) + 5; // between 5 and 10      
                    const randUpDown = Math.round(Math.random() * (this.wiggle.maxRadialOffset - this.wiggle.minRadialOffset)) + this.wiggle.minRadialOffset;
    
                    this.wiggle.segments.push({
                        initialSegmentSize: segment,
                        curSegmentSize: segment,
                        initialRadialOffset: randUpDown,
                        curRadialOffset: randUpDown,
                        radialDirection: 'up',
                        initialCP1Offset: randInt1, 
                        curCP1Offset: randInt1,
                        initialCP2Offset: randInt2, 
                        curCP2Offset: randInt2,     
                        CPdirection: 'right'           
                    })
                })
            }
        }
}

export {WigglyCircle}