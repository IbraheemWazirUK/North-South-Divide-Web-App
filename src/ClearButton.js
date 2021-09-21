import { useState} from "react"
const ClearButton = (props) => {
    const [hover, setHover] = useState(false);
    return (  
        <button 
        key = {props.buttonColor} 
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={ props.clear } 
        style = {{...props.buttonStyle, ...(hover ? {backgroundColor: "#839192"} : {backgroundColor: props.buttonColor})}}> Clear </button>
    );
}
 
export default ClearButton;