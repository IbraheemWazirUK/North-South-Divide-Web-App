import { useState} from "react"
const SaveButton = (props) => {
    const [hover, setHover] = useState(false);
    return (  
        <button 
        key = {props.buttonColor} 
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={ props.save } 
        style = {{...props.buttonStyle, ...(hover ? {backgroundColor: "#839192"} : {backgroundColor: props.buttonColor})}}> Save </button>
    );
}
 
export default SaveButton;