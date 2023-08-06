
import SectionTitle from "../components/SectionTitle"
import styles from "./Support.css"

const Support = () => {


    return (
        <>
            <div className="supportContainer">
                <SectionTitle sectionName={'Soporte'} />
                <p>¿Tienes alguna duda o inconveniente? Envianos un mensaje</p>
                <form className="supportForm">
                    <label for="supportText">Tu mensaje</label>
                    <textarea id="supportText" name="supportText" placeholder="Escribe tu consulta" />
                    <input type="submit" value="Enviar Consulta"/>
                </form>
             
            </div>

        </>


    );
}

export default Support;
