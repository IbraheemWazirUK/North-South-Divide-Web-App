import { useRef, useState, useEffect } from 'react';
import Message from './Message';
import ClearButton from './ClearButton';
import SaveButton from './SaveButton';
import map from './assets/map.png';

const Canvas = (props) => {
    const drawingStatus = useRef("none");
    const canvasRef = useRef(null);
    const currX = useRef(null);
    const currY = useRef(null);
    const xs = useRef([]);
    const ys = useRef([]);
    const enteredLand = useRef(false);
    const [message, setMessage] = useState("");
    const [temp, setTemp] = useState(0);
    const buttonStyle = {
        border: "none",
        color: "white",
        padding: "15px 30px",
        textAlign: "center",
        textDecoration: "none",
        display: "inline-block",
        fontSize: "16px",
        margin: "10px",
    };
    const [buttonColor, setButtonColor] = useState("#839192");


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
            setButtonColor("#F39C12");
            // if user starts from inside the map, tell user to start from outside
            if (alpha !== 0) {
                setMessage("You can't start drawing the line from inside the border");
                setButtonColor("#839192");
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
                setButtonColor("#839192");
                xs.current = [];
                ys.current = [];
                drawingStatus.current = "none";
            }
        }
        if (drawingStatus.current === "drawn") {
            if ((new Set(xs.current)).size !== xs.current.length) {
                setMessage("The line should have no horizontal turns");
                setButtonColor("#839192");
                xs.current = [];
                ys.current = [];
                drawingStatus.current = "none";
            }
        } 
        
        
    }

    const handleSaveButton = () => {
        if (drawingStatus.current === "drawn") {
            // TODO: send xs and ys to db, draw saved line, draw average line

            setButtonColor("#839192");
            drawingStatus.current = "saved";
        } 



    }

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx  = canvas.getContext("2d");
        ctx.clearRect(0, 0, 499, 601);    
    }

    const handleClearButton = () => {
        clear();
        drawingStatus.current = "none";
        xs.current = [];
        ys.current = [];
        setButtonColor("#839192");
        setTemp(1 - temp);
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
            <ClearButton clear = {handleClearButton} buttonStyle={buttonStyle} buttonColor={buttonColor} />
            <SaveButton save = {handleSaveButton} buttonStyle={buttonStyle} buttonColor={buttonColor} />
            <Message message = { message }/>
            <canvas ref={canvasRef} {...props} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            </canvas>
        </div>
    );
}
 
export default Canvas;