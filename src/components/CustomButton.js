import './CustomButton.css';

const CustomButton = (props) => {
    const classes = ' ' + props.className;

    return <button className={classes}>{props.children} {props.text}</button>;
};

export default CustomButton;