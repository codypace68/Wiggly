import {Wiggle} from '../../src/WigglyMain.js';
const canvas = document.createElement('canvas');
canvas.id = 'test';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'fixed';

const wiggles = [];

document.getElementById('wiggle-circle').appendChild(canvas);
// document.getElementById('wiggle-circle').appendChild(canvas2);

canvas.addEventListener('click', (e) => {
    const shadowBlur = Math.round(Math.random() * 15);

    const wiggle = new Wiggle ({
        type: 'circle',
        x1: e.clientX,
        y1: e.clientY,
        canvas: canvas,
        radius: Math.round(Math.random() * 40) + 30,
        wiggleSegments: Math.round(Math.random() * 5) + 5,
        shadowBlur: shadowBlur,
        color: `rgba(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.random()})`,
    })

    wiggle.draw();
});

