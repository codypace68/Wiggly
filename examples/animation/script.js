
let delay = 1000 / 60; // 60fps
let frame = 0;
let time = null;


animateLoop(0);
function animateLoop(timestamp) {
    // animate at 60fps
    if (time === null) time = timestamp;

    let seg = Math.floor((timestamp - time) / delay);

    if (seg > frame) {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        canvas2.getContext('2d').clearRect(0, 0, canvas2.width, canvas2.height)
        frame = seg;
        //canvas.getContext('2d').clearRect(0,0,canvas.width, canvas.height)
        wiggles.forEach(wiggle => {
            wiggle.draw();
        })
    }


    window.requestAnimationFrame((timestamp) => {
            animateLoop(timestamp);            
    })
}