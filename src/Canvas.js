import { useRef, useState, useEffect } from 'react';
import Message from './Message';
import map from './assets/map.png';

const Canvas = (props) => {
    const drawingStatus = useRef("none");
    const canvasRef = useRef(null);
    const currX = useRef(null);
    const currY = useRef(null);
    const xs = useRef([]);
    const ys = useRef([]);
    const [xsProp, setXsProp] = useState([]);
    const [ysProp, setYsProp] = useState([]);
    const enteredLand = useRef(false);
    const [message, setMessage] = useState("");

    const getData = (e) => {
        const canvas = canvasRef.current;
        const ctx  = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = e.pageX - rect.left;
        const y = e.pageY - rect.top;
        const alpha = ctx.getImageData(x, y, 1, 1).data[3];
        return [x, y, alpha]
    }

    const draw = (prevX, prevY) => {
        const canvas = canvasRef.current;
        const ctx  = canvas.getContext("2d");
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX.current, currY.current);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
    }
    const handleMouseDown = (e) => {
        if (drawingStatus.current === "none") {
            const data = getData(e);
            const [x, y, alpha] = data;
            // if user starts from inside the map, tell user to start from outside
            if (alpha !== 0) {
                setMessage("You can't start drawing the line from inside the border");
                return;
            } else {
                setMessage("");
                drawingStatus.current = "drawing";
                enteredLand.current = false;
                currX.current = x;
                currY.current = y;
                xs.current = [x]
                ys.current = [y]
            }
        }
    }
    const handleMouseMove = (e) => {
        if (drawingStatus.current !== "drawing") {
            return;
        }
        const prevX = currX.current;
        const prevY = currY.current;
        const data = getData(e);
        const [x, y, alpha] = data;
        currX.current = x;
        currY.current = y;
        if (alpha !== 0) {
            enteredLand.current = true;
            draw(prevX, prevY);
            xs.current = [...xs.current, x];
            ys.current = [...ys.current, y];
        } else {
            if (enteredLand.current) {
                drawingStatus.current = "drawn";
            }
        }
    }

    const handleMouseUp = (e) => {
        if (drawingStatus.current === "drawing") {
            const data = getData(e);
            const alpha = data[2];
            // if user ends somewhere inside the map, tell user to end somewhere outside
            if (alpha !== 0) {
                setMessage("You can't end drawing the border somewhere inside the border");
                xs.current = [];
                ys.current = [];
                drawingStatus.current = "none";
            }
        }
        if (drawingStatus.current === "drawn") {
            if ((new Set(xs.current)).size !== xs.current.length) {
                setMessage("The line should have no horizontal turns");
                xs.current = [];
                ys.current = [];
                drawingStatus.current = "none";
            }
        }
        if (drawingStatus.current === "drawn") {
            setXsProp(xs.current);
            setYsProp(ys.current);
        }
        
    }

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx  = canvas.getContext("2d");
        ctx.clearRect(0, 0, 499, 601);    
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx  = canvas.getContext("2d");
        const scaleFactor = 0.95;
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
            <Message message = { message }/>
            <canvas ref={canvasRef} {...props} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            </canvas>
        </div>
    );
}
 
export default Canvas;