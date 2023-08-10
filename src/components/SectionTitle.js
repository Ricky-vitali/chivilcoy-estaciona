import styles from './SectionTitle.css'

function DynamicTitle(props) {

    return (

        <div className="sectionTitleContainer">
            <h2>{props.sectionName}</h2>
            <hr />
        </div>
    )
}


export default DynamicTitle;