import {Wiggle} from '../../src/WigglyMain.js';
const canvas = document.createElement('canvas');
canvas.id = 'shapes';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.zIndex = 9999;
canvas.style.position = 'fixed';
canvas.style.top = '0px';
canvas.style.left = '0px';

document.getElementById('wiggle-rectangle').appendChild(canvas);


canvas.addEventListener('click', (e) => {
    if (!canvas.classList.contains('fade-in')) canvas.classList.add('fade-in');

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

