import { useRef, useState, useEffect } from 'react';
import map from './assets/map.png';

const Canvas = (props) => {
    const isDrawing = useRef(false);
    const canvasRef = useRef(null);
    const [lines, setLines] = useState([]);

    const getData = (e) => {
        const canvas = canvasRef.current;
        const ctx  = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = e.pageX - rect.left;
        const y = e.pageY - rect.top;
        const alpha = ctx.getImageData(x, y, 1, 1).data;
        return [x, y, alpha]
    }
    const handleMouseDown = (e) => {
        const data = getData(e);
        const alpha = data[2];
        console.log(alpha);
        isDrawing.current = true;
    }
    const handleMouseMove = () => {
        console.log("hi");
    }

    const handleMouseUp = () => {
        isDrawing.current = false;
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx  = canvas.getContext("2d");
        const scaleFactor = 1;
        const width = 499;
        const height = 601;
        canvas.width = width*scaleFactor;
        canvas.height = height*scaleFactor;
        const background = new Image();
        background.src = map;
        background.onload = () => {
            ctx.drawImage(background, 0, 0, width*scaleFactor, height*scaleFactor);
        }
        background.crossOrigin = "Anonymous";
    })    

    return (
        <div>
            <canvas ref={canvasRef} {...props} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            </canvas>
        </div>
    );
}
 
export default Canvas;