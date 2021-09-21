const Message = (props) => {
    return (  
        <div>
            <p key={ props.message }> { props.message } </p>
        </div>
    );
}
 
export default Message ;