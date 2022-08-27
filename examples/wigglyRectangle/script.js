import {Wiggle} from '../../src/WigglyMain.js';
const canvas = document.createElement('canvas');
canvas.id = 'shapes';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.zIndex = 10;
canvas.style.position = 'fixed';

document.getElementById('wiggle-rectangle').appendChild(canvas);


canvas.addEventListener('click', (e) => {
    const shadowBlur = Math.round(Math.random() * 15);
    const rect = canvas.getBoundingClientRect();

    const wiggle = new Wiggle({
        type: 'rectangle',
        x1: e.clientX - rect.left,
        y1: e.clientY - rect.top,
        width: Math.random() * 700 + 100,
        height: Math.random() * 700 + 100,
        canvas: canvas,
        shadowBlur: 5,
        //drawRectangleShape: true,
        shadowBlur: shadowBlur,
        wiggleSegments: Math.round(Math.random() * 60 + 5),
        //text: shadowBlur,
        //drawTextShape: true,
        color: `rgb(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)})`,
    })

    wiggle.draw();
});

