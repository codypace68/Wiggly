import {Wiggle} from '../../src/WigglyMain.js';
const canvas = document.createElement('canvas');
canvas.id = 'test';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.zIndex = 9999;
canvas.style.position = 'fixed';
canvas.style.top = '0px';
canvas.style.left = '0px';

document.getElementById('wiggle-circle').appendChild(canvas);

canvas.addEventListener('touchstart', (e) => {
    if (!canvas.classList.contains('fade-in')) canvas.classList.add('fade-in');
    const shadowBlur = Math.round(Math.random() * 15);


    const touch = e.touches[0]
    const wiggle = new Wiggle ({
        type: 'circle',
        x1: touch.clientX,
        y1: touch.clientY,
        canvas: canvas,
        radius: Math.round(Math.random() * 40) + 30,
        wiggleSegments: Math.round(Math.random() * 5) + 5,
        shadowBlur: shadowBlur,
        color: `rgba(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.random()})`,
    })

    wiggle.draw();
});

