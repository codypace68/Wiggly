import {Animation} from '../../src/AnimationMain.js';
import {Wiggle} from '../../src/WigglyMain.js';
const canvas = document.createElement('canvas');
canvas.id = 'test';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'fixed';

document.getElementsByTagName('div')[0].appendChild(canvas);


let animation = new Animation();

animation.addObjectToAnimate(new Wiggle ({
    type: 'circle',
    x1: 150,
    y1: 150,
    canvas: canvas,
    radius: Math.round(Math.random() * 40) + 30,
    wiggleSegments: Math.round(Math.random() * 5) + 5,
    shadowBlur: 10,
    color: `rgba(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.random()})`,
}))

animation.addObjectToAnimate(new Wiggle ({
    type: 'circle',
    x1: 250,
    y1: 150,
    canvas: canvas,
    radius: Math.round(Math.random() * 40) + 30,
    wiggleSegments: Math.round(Math.random() * 5) + 5,
    shadowBlur: 10,
    color: `rgba(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.random()})`,
}))

animation.addObjectToAnimate(new Wiggle ({
    type: 'circle',
    x1: 150,
    y1: 350,
    canvas: canvas,
    radius: Math.round(Math.random() * 40) + 30,
    wiggleSegments: Math.round(Math.random() * 5) + 5,
    shadowBlur: 10,
    color: `rgba(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.random()})`,
}))

animation.startAnimations();