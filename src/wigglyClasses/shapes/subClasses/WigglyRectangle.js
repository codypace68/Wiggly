import { WigglyShape } from "../WigglyShape.js";

/**
 * Class for WigglyCircle object
 * @extends WigglyShape
 */
class WigglyRectangle extends WigglyShape {
    /**
    * constructor of WigglyCircle class exposed by {@link init}
    * @param {Object} config
    * @param {Integer} config.x1 x1 and y1 compose first point of rectangle
    * @param {Integer} config.y1 x1 and y1 compose first point of rectangle
    * @param {Integer} config.width width of rectangle
    * @param {Integer} config.height height of rectangle
    * @param {HTMLElement} config.canvas HTML canvas element to render WigglyCircle on
    * @param {String}  [config.text=""] Text value to render in center of WigglyCircle when <i>config.drawTextShape == true </i>.
    * @param {Boolean} [config.drawWiggleShape=true] <b>DevTool:</b> determines whether to render to "wiggles" on the edge of the circle
    * @param {Boolean} [config.drawScallopShape=false] <b>DevTool:</b> determines whether to render the base scallop shape that wiggles are based on.
    * @param {Boolean} [config.drawTextShape=false] <b>DevTool:</b> determines whether to render <i>config.text</i> value in center of WiggleCircle.
    * @param {Boolean} [config.drawSegmentBoundaryShape=false] <b>DevTool:</b> determines whether to render lines segmenting circle at each "wiggle" boundary.
    */
    constructor(config) {
        super(config);
        this.x1 = config.x1;
        this.y1 = config.y1;
        this.width = config.width;
        this.height = config.height;
        this.circumference = this.width * 2 + this.height * 2;
        
        // decide which shapes should be drawn
        this.drawScallopShape = config.drawScallopShape || false;
        this.drawWiggleShape = config.drawWiggleShape || true;
        this.drawTextShape = config.drawTextShape || false;
        this.drawRectangleShape = config.drawRectangleShape || false;
        this.drawSegmentBoundaryShape = config.drawSegmentBoundaryShape || false;
        this.rotationAngle = config.rotationAngle || 0;
        this.currentRotation = 0;
        console.log(this.rotationAngle);

        // display options
        this.wiggleSegments = config.wiggleSegments || 5;
        this.text = config.text || "";
        this.shadowBlur = config.shadowBlur || "";
        this.shadowColor = config.shadowColor || "black";


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
        if (this.drawRectangleShape) this.drawRectangle();
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
        this.ctx.fillText(this.text, this.x1 + (this.width / 2), this.y1 + (this.height / 2));
    }

    /**
     * Draws the describe rectangle
     */
    drawRectangle() {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgba(233,34,32,.2)';
        this.ctx.rect(this.x1, this.y1, this.width, this.height);
        this.ctx.stroke();
        this.ctx.fill();
    }

    drawWiggle() {          
        const centerPointx = this.x1 + this.width / 2;
        const centerPoitny = this.y1 + this.height / 2;

        if (this.rotationAngle > 0) {
            this.ctx.translate(centerPointx, centerPoitny)
            this.ctx.rotate((Math.PI / 180) * this.currentRotation);
            this.ctx.translate(-centerPointx, -centerPoitny)
        }


        this.degreeRotation += .2;
        this.ctx.beginPath();
        this.ctx.shadowBlur = this.shadowBlur;
        this.ctx.shadowColor = this.shadowColor;

        for (let key in this.wiggle.segments) {
            let curSegment;
            let nextSegment;
            let x1 = this.x1;
            x1 += this.wiggle.xOffset;
            let y1 = this.y1;
            let x2 = this.x1;
            x2 += this.wiggle.xOffset;
            let y2 = this.y1;
            let rect = this.canvas.getBoundingClientRect();
            let segSizeLeft = 0;
            let firstDown = false;
            let shapeDone = false;
            let arcPositions = [];

            for (let i = 0; i < this.wiggle.segments[key].length; i++){
                curSegment = this.wiggle.segments[key][i];
                nextSegment = i + 1 >= this.wiggle.segments[key].length ? this.wiggle.segments[key][0] : this.wiggle.segments[key][i + 1];   
                segSizeLeft = curSegment.curSegmentSize;    

                //this.ctx.arc(x1,y1,5,0,7)
                if (key === 'top') {
                    if (i === 0) this.ctx.moveTo(x1,y1);

                    x1 = x2;
                    x2 += curSegment.curSegmentSize;
                    this.ctx.bezierCurveTo(x1 + curSegment.curCP1Offset, y1 - curSegment.curRadialOffset, x2 + curSegment.curCP1Offset, y1 - curSegment.curRadialOffset, x2, y1);
                }

                if (key === 'right') {
                    if (i === 0) {
                        x1 = x1 + this.width;
                    }

                    y1 = y2;
                    y2 += curSegment.curSegmentSize;
                    
                    this.ctx.bezierCurveTo(x1 + curSegment.curRadialOffset, y1 + curSegment.curCP1Offset, x1 + curSegment.curRadialOffset, y2  + curSegment.curCP1Offset, x1, y2);
                }

                if (key === 'bottom') {
                    if (i === 0) {
                        y1 = y1 + this.height;
                        x1 = x2 = x1 + this.width;
                    }

                    x1 = x2;
                    x2 -= curSegment.curSegmentSize;
                    this.ctx.bezierCurveTo(x1 + curSegment.curCP1Offset, y1 + curSegment.curRadialOffset, x2 + curSegment.curCP1Offset, y1 + curSegment.curRadialOffset, x2, y1);

                }

                if (key === 'left') {
                    if (i === 0) {
                        y1 = y2 = y1 + this.height;
                    }

                    y1 = y2;
                    y2 -= curSegment.curSegmentSize;
                    
                    this.ctx.bezierCurveTo(this.x1 - curSegment.curRadialOffset, y1 + curSegment.curCP1Offset, this.x1 - curSegment.curRadialOffset, y2 + curSegment.curCP1Offset, this.x1, y2);
                }


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
        }

        // this.wiggle.randomizeSegments();        
        this.ctx.closePath();

        //xCenter = (x1 + x2) / 2
        //yCenter = (y1 + y2) / 2


        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.strokeStyle = this.border;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        if (this.rotationAngle > 0) {
            this.ctx.translate(centerPointx, centerPoitny)
            this.ctx.rotate(-((Math.PI / 180) * this.currentRotation));
            this.ctx.translate(-centerPointx, -centerPoitny)
            this.currentRotation += this.rotationAngle;
        }


        

        // arcPositions.forEach(arc => {
        //     this.ctx.beginPath();
        //     this.ctx.arc(arc[0], arc[1], 6, 0, 7);
        //     this.ctx.fillStyle = "rgb(255,255,255)";
        //     this.ctx.fill();
        //     this.ctx.closePath();
        // })

        // this.ctx.beginPath();
        // this.ctx.arc(centerPointx,centerPoitny,10,0,8);
        // this.ctx.fillStyle = "rgb(255,255,255)";
        // this.ctx.fill();
        // this.ctx.closePath();

        // this.ctx.beginPath();
        // this.ctx.arc(this.x1,this.y1,10,0,8);
        // this.ctx.fillStyle = "rgb(255,234,120)";
        // this.ctx.fill();
        // this.ctx.closePath();

        // this.ctx.beginPath();
        // this.ctx.arc(this.x1 + this.width / 2,this.y1,10,0,8);
        // this.ctx.fillStyle = "rgb(255,11,54)";
        // this.ctx.fill();
        // this.ctx.closePath();

        
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
        segments: {
            top: [],
            right: [],
            bottom: [],
            left: []
        },
        numSegments: 0,
        minRadialOffset: null,
        maxRadialOffset: null,
        curRadialOffset: 20,
        xOffset: 0,
        maxCPOffset: 100,
        minCPOffset: 0,   
        CPIncrement: .2, 
        radialIncrement: .2,
        setMaxMinRadial: () => {
            this.wiggle.minRadialOffset = this.circumference * .01;
            this.wiggle.maxRadialOffset = this.circumference * .01 + 25;
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

        },
        createSegements: () => {
            // randomize width of segments on initialization
            let numArray = [];
            let totalOfRandom = 0;
            let total = 0;
            let sides = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            }

            // sudo-code for this found below
            // https://stackoverflow.com/questions/19277973/generate-4-random-numbers-that-add-to-a-certain-value-in-javascript

            // if the total number of segments is an odd number increment by on
            // we need an even number to divide correctly among sides
            if (this.wiggle.numSegments % 2 !== 0) this.wiggle.numSegments ++;

            // first we need to determine how many segments there will be for each side of the rectangle
            sides.left = sides.right = Math.round((this.height / this.circumference) * this.wiggle.numSegments);
            sides.top = sides.bottom = Math.round((this.width / this.circumference) * this.wiggle.numSegments);
            

            // start by getting an array of random numbers
            for (let key in sides) {
                let numArray = fillArray(sides[key]);
                let sideLength = key === 'left' || key === 'right' ? this.height : this.width;

                // then we get the total of these random numbers
                totalOfRandom = this.totalArray(numArray);

                

                // finally we normalize the array based off total we desire (here it's width * 2 + height * 2 degrees)
                for (let i = 0; i < numArray.length; i++) {
                    numArray[i] = Math.round(numArray[i] * (sideLength / totalOfRandom));
                }

                
                // Finally we need to ensure the randomize ints total to 360 as we can miss a degree or two due to rounding
                total = this.totalArray(numArray);

                if (total !== sideLength) {
                    let tempTotal = 0;
                    for (let i = 0; i < numArray.length; i++) {
                        if (i + 1 == numArray.length) {
                            numArray[i] = sideLength - tempTotal;
                        } else {
                            tempTotal += numArray[i];
                        }
                    }
                }

                numArray.forEach(segment => {
                    const randInt1 = Math.round(Math.random() * 10) + 5; // between 5 and 10
                    const randInt2 = Math.round(Math.random() * 10) + 5; // between 5 and 10      
                    const randUpDown = Math.round(Math.random() * (this.wiggle.maxRadialOffset - this.wiggle.minRadialOffset)) + this.wiggle.minRadialOffset;
    
                    this.wiggle.segments[key].push({
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




            function fillArray(numSegs) {
                let randArray = [];
                for (let i = 0; i < numSegs; i++) {
                    let randInt = Math.round(Math.random() * 10 + 10);
    
                    randArray.push(randInt)
                }

                return randArray;
            }
        }
    }
}

export {WigglyRectangle}