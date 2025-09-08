import React from 'react';

interface PrivacyPolicyModalProps {
    onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
    return (
        <div className="text-slate-300">
            <h2 id="modal-title" className="text-2xl font-bold text-white mb-6">
                Política de Privacidad y Uso de Cookies
            </h2>
            <div className="space-y-4 text-sm max-h-[60vh] pr-4 -mr-4 overflow-y-auto">
                <h3 className="text-lg font-semibold text-slate-100 mt-4">1. ASPECTOS GENERALES</h3>
                <p>La presente Política de Privacidad (La Política de Privacidad) se aplica tanto al sitio web como a la aplicación móvil Gespadel.app (la “App”), así como a dominios y subdominios, páginas web y aplicaciones móviles dependientes de la misma. El responsable del tratamiento de los datos personales es GRUPO INFINITY, S.COOP.AND, con domicilio a estos efectos en Urb. Parque Botánico, E316, 29679, Benahavís, Málaga con NIF F16945909, en adelante GRUPO INFINITY.</p>
                <p>La edad legal del consentimiento, tal y como establece la LO 3/2018, es de 14 años, por lo tanto, el Usuario certifica que es mayor de 14 años y que por lo tanto posee la capacidad legal necesaria para la prestación del consentimiento en cuanto al tratamiento de sus datos de carácter personal y todo ello, de conformidad con lo establecido en la presente Política de Privacidad.</p>
                <p>Se comunicarán datos a terceros para poder llevar a cabo las finalidades descritas en la presente política de privacidad. En ningún caso se cederán datos a terceros para finalidades diferentes a las descritas en este documento.</p>
                <p>En cuanto a sus derechos, usted puede acceder, rectificar y suprimir los datos, así como otros derechos, dirigiéndose por escrito a info@melenamarketing.com.</p>
                <p>La presente Política de Privacidad tiene por objeto facilitar información sobre los derechos que le asisten en virtud de lo establecido en el REGLAMENTO (UE) 2016/679 DEL PARLAMENTO EUROPEO y del CONSEJO, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos y por el que se deroga la Directiva 95/46/CE (Reglamento general de protección de datos) y la LO 3/2018. La información sobre sus datos de carácter personal, según el artículo 13 de la sección 2 del citado reglamento y la LO 3/2018.</p>
                <p>Al facilitarnos sus datos, al/los usuario/s (el/los “Usuario/s”) declara haber leído y conocer la presente Política de Privacidad, prestando su consentimiento inequívoco y expreso al tratamiento de sus datos personales de acuerdo a las finalidades y términos aquí expresados.</p>
                <p>GRUPO INFINITY podrá modificar la presente Política de Privacidad para adaptarla a las novedades legislativas, jurisprudenciales o de interpretación de la Agencia Española de Protección de Datos. Estas condiciones de privacidad podrán ser complementadas por el Aviso Legal, Política de Cookies y las Condiciones Generales que, en su caso, se recojan para determinados productos o servicios, si dicho acceso supone alguna especialidad en materia de protección de datos de carácter personal.</p>
                <p>Asimismo, GRUPO INFINITY informa al/los “Usuario/s” de la App acerca de la Política de Privacidad que aplicará en el tratamiento de los datos personales que el Usuario facilite al registrarse en la App mediante la cumplimentación del formulario de registro habilitado al efecto en los mismos, (el “Formulario de Registro”) así como durante el proceso de inscripción en las competiciones deportivas en las que participe.</p>
                <p>Para poder navegar en la App no es necesario que los Usuarios revelen sus datos personales. No obstante, en ciertos casos GRUPO INFINITY podrá requerir determinados datos, para poder ofrecerle los servicios deseados.</p>
                <p>La cumplimentación del Formulario de Registro por parte de los Usuarios así como los datos proporcionados durante el proceso de inscripción en las competiciones deportivas o mediante cualquier tipo de interactuación con GRUPO INFINITY, implica necesariamente, y sin reservas, el conocimiento y aceptación de la presente Política de Privacidad así como de las Condiciones de Uso, para lo que los Usuarios deberán validar la casilla habilitada al efecto en el Formulario de Registro o en el proceso de inscripción en las competiciones deportivas. Por tanto, se recomienda al Usuario que, con carácter previo, lea detenidamente dichos textos legales.</p>

                <h3 className="text-lg font-semibold text-slate-100 mt-4">2. TRATAMIENTO DE LOS DATOS DE CARÁCTER PERSONAL</h3>
                <h4 className="text-md font-semibold text-slate-200 mt-2">2.1. Recopilación de datos de carácter personal</h4>
                <p>Toda vez que el Usuario cree una cuenta en nuestra App, ya sea directamente o a través de redes sociales, realice una inscripción en las competiciones deportivas, grupos o partidos a través de nuestra App o, a través de páginas o apps de GRUPO INFINITY con dominio personalizado, o interactúe de alguna manera con nosotros, recopilaremos datos de carácter personal al objeto de poder gestionar la prestación de servicios requerida.</p>
                <p>Mediante la cumplimentación del Formulario de Registro, los Usuarios deberán proporcionar los siguientes datos, los cuales deberán ser exactos y veraces: nombre, apellidos, correo electrónico, contraseña, ciudad, fecha de nacimiento, sexo, deporte que practica y nivel de juego.</p>
                <p>Asimismo, durante el proceso de inscripción en las competiciones deportivas, podrán ser solicitados datos adicionales (como por el ejemplo el DNI, licencia de seguro, número de teléfono, talla de ropa o calzado para las equipaciones, fotografías, etc.) al objeto de llevar a cabo la ejecución de los servicios.</p>
                <p><strong>Información sobre otras personas.</strong> Si realiza la inscripción a una competición en pareja o en equipo tendrá que introducir datos personales de otra/s persona/s en el formulario de inscripción de la competición. Para ello, debe obtener el consentimiento de esa/s persona/s antes de proporcionarnos su información personal, ya que el acceso para visualizar o modificar tal información solo estará disponible a través de su cuenta. Le recordamos que el uso de esta información se hará siempre de acuerdo con la Ley de Protección de datos aplicable, por lo tanto, usted declara tener el consentimiento previo y expreso de cada uno de los jugadores cuyos datos de carácter personal deberá de cumplimentar en el formulario para llevar a cabo la inscripción.</p>
                <p>El Usuario deberá notificar a GRUPO INFINITY cualquier modificación que se produzca en los datos que haya facilitado, respondiendo en cualquier caso de la veracidad y exactitud de los datos suministrados en cada momento.</p>
                <p>GRUPO INFINITY, ha adoptado las medidas necesarias de índole técnica y organizativa para mantener el nivel de seguridad requerido, según la naturaleza de los datos personales tratados y las circunstancias del tratamiento, con el objeto de evitar, en la medida de lo posible y siempre según el estado de la técnica, su alteración, pérdida, tratamiento o acceso no autorizado.</p>
                <p><strong>Menores de edad.</strong> La edad legal del consentimiento, tal y como establece la LO 3/2018, es de 14 años, por lo tanto, el Usuario certifica que es mayor de 14 años y que por lo tanto posee la capacidad legal necesaria para la prestación del consentimiento en cuanto al tratamiento de sus datos de carácter personal y todo ello, de conformidad con lo establecido en la presente Política de Privacidad. Aquellos que no cumplan con esta condición deberán abstenerse de suministrar información personal en la App para ser incluida en las bases de datos de GRUPO INFINITY.</p>
                <p>Sin embargo, con el previo consentimiento de sus tutores o representantes legales, los menores de 14 años podrán proceder a la inclusión de sus datos personales en los formularios de la App.</p>
                <p><strong>Otra información.</strong> Estamos mejorando nuestros Servicios, lo que significa que recibimos nuevos datos y creamos nuevos modos de utilizar los datos.</p>
                <p>Nuestros Servicios son dinámicos y con frecuencia introducimos nuevas funcionalidades, que pueden requerir la recopilación de nueva información. Si recabamos datos personales muy diferentes o si cambiamos en gran medida el modo en que usamos tus datos, te lo notificaremos y también podríamos modificar esta Política de privacidad.</p>
                
                <h4 className="text-md font-semibold text-slate-200 mt-2">2.2. Finalidades del tratamiento</h4>
                <p>GRUPO INFINITY utiliza la información que recopilamos con los siguientes propósitos generales:</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Para registrar y gestionar su cuenta, así como para permitirle acceder a nuestra App y utilizarla.</li>
                    <li>Para comunicarnos contigo en relación a los partidos, grupos, competiciones deportivas, incluso para proporcionarle información acerca de GRUPO INFINITY y sus servicios.</li>
                    <li>Para ponerte en contacto con el organizador de competiciones y eventos deportivos, cuando sea necesario para la ejecución de un contrato de prestación de servicios o cuando se haya obtenido el consentimiento previo y expreso para ello.</li>
                    <li>Para que nos permita publicar sus opiniones, publicaciones en foros y otros contenidos en la comunidad de Gespadel.app.</li>
                    <li>Para ponerle en contacto con otros jugadores y facilitar la práctica de deporte.</li>
                    <li>Para responder a sus preguntas y comentarios.</li>
                    <li>Para medir su interés en nuestros productos y servicios, así como en nuestra App, y para mejorarlos.</li>
                    <li>Para notificarte las ofertas especiales e informarle de los productos y servicios disponibles.</li>
                    <li>Para notificarte recordatorios, información y resultados de las competiciones en las que juegas.</li>
                    <li>Para notificarte sobre nuevas competiciones en tu zona.</li>
                    <li>Para solicitarte información, incluso mediante encuestas.</li>
                    <li>Para resolver conflictos o solucionar problemas.</li>
                    <li>Para evitar actividades potencialmente prohibidas o ilegales.</li>
                    <li>Para hacer cumplir nuestras Condiciones de Uso.</li>
                    <li>Para lo descrito de cualquier otro modo en el momento de la recopilación.</li>
                    <li>Para controlar y analizar tendencias, usos y actividades en relación con nuestra plataforma.</li>
                    <li>También podemos procesar información para cumplir con las obligaciones legales.</li>
                </ul>

                <h4 className="text-md font-semibold text-slate-200 mt-2">2.3. Modalidad de Tratamiento</h4>
                <p>GRUPO INFINITY tratará los Datos de los Usuarios de manera adecuada y adoptará las medidas de seguridad apropiadas para impedir el acceso, la revelación, alteración o destrucción no autorizados de los Datos.</p>
                <p>El tratamiento de Datos se realiza mediante ordenadores y/o herramientas informáticas, siguiendo procedimientos y modalidades organizativas estrictamente relacionadas con las finalidades señaladas. Además del Responsable de Tratamiento, en algunos casos podrán acceder a los Datos ciertas categorías de personas encargadas relacionadas con el funcionamiento de la página (administración, ventas, marketing, departamento jurídico y de administración de sistemas) o contratistas externos que presten servicios al Responsable de Tratamiento (tales como proveedores externos de servicios técnicos, empresas de mensajería, “hosting providers”, empresas de informática, agencias de comunicación) que serán nombrados por el Titular como Encargados del Tratamiento, si fuera necesario. Se podrá solicitar al Responsable de Tratamiento en cualquier momento una lista actualizada de dichas personas.</p>

                <h4 className="text-md font-semibold text-slate-200 mt-2">2.4 Lugar de tratamiento</h4>
                <p>Los Datos serán tratados en la sede operativa del Responsable de Tratamiento, así como en otros lugares en los que se encuentren situadas las partes que también estén involucradas en dicho tratamiento. Para más información, por favor póngase en contacto con el Responsable de Tratamiento.</p>

                <h4 className="text-md font-semibold text-slate-200 mt-2">2.5. Período de conservación</h4>
                <p>GRUPO INFINITY informa a sus Usuarios de que sus datos personales serán conservados durante el tiempo estrictamente necesario para las finalidades del tratamiento para cuyo uso hayan sido proporcionados, siempre que el Usuario no haya revocado su consentimiento y, en todo caso, siguiendo como criterio el principio de minimización de datos contemplado en la normativa aplicable.</p>
                <p>En particular, los datos personales proporcionados por los Usuarios se conservarán por el plazo determinado sobre la base de los siguientes criterios: (i) obligación legal de conservación; (ii) duración de la relación contractual y atención de cualesquiera responsabilidades derivadas de dicha relación; (iii) solicitud de supresión por parte del interesado en los supuestos en los que proceda.</p>
                <p>En consecuencia, cuando su uso no sea necesario, los datos personales serán bloqueados quedando sólo a disposición de las autoridades competentes durante el tiempo y a los efectos legales establecidos en la normativa aplicable. Transcurrido este plazo se procederá a la eliminación de los mismos.</p>

                <h3 className="text-lg font-semibold text-slate-100 mt-4">3. Comunicación de datos</h3>
                <p>Le informamos de que no cedemos sus datos personales a terceros salvo obligación legal, sin embargo, podrán tener acceso a sus datos personales los encargados de tratamiento de la Empresa, es decir, aquellos prestadores de servicios que tengan que acceder a sus datos para el desarrollo de sus funciones. Los prestadores de servicios que acceden a sus datos personales, con carácter general, se dedican a los sistemas de la información y tecnología.</p>
                <p>No está prevista la realización de transferencias de datos a terceros países.</p>

                <h3 className="text-lg font-semibold text-slate-100 mt-4">4. Derechos</h3>
                <p>Cualquier persona tiene derecho a obtener confirmación sobre si en la empresa estamos tratando datos personales que les conciernan, o no.</p>
                <p>En concreto, puede usted dirigirse a la empresa a su dirección postal o bien a la dirección de email facilitada en el presente documento con la finalidad de ejercer los siguientes derechos:</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Derecho a solicitar el acceso a los datos personales relativos al interesado.</li>
                    <li>Derecho a solicitar su rectificación o supresión.</li>
                    <li>Derecho a solicitar la limitación de su tratamiento.</li>
                    <li>Derecho a oponerse al tratamiento.</li>
                    <li>Derecho a la portabilidad de los datos.</li>
                </ul>
                <p>Puede usted solicitar los formularios necesarios para el ejercicio de estos derechos enviando un correo electrónico a la dirección de email info@melenamarketing.com.</p>
                <p>Dado el carácter personalísimo del ejercicio de cualquiera de estos derechos usted deberá adjuntar a la solicitud copia de su carnet de identidad o documento acreditativo equivalente.</p>
                <p>Puede usted dirigirse a la Agencia Española de protección de Datos para obtener información adicional acerca de sus derechos o presentar una reclamación ante la misma, especialmente cuando no haya obtenido satisfacción en el ejercicio de sus derechos, obteniendo toda la información necesaria para ello a través de la web www.agpd.es</p>

                <h3 className="text-lg font-semibold text-slate-100 mt-4">5. Valoramos su colaboración</h3>
                <p>En GRUPO INFINITY procuramos controlar, dentro de nuestras posibilidades, el uso correcto de los datos personales de los que somos responsables por parte de terceros a quienes se los hayamos tenido que facilitar. Por tal motivo le solicitamos que, en caso de que tenga conocimiento o sospecha de que cualquiera de nuestros clientes o proveedores, antes indicados, está haciendo un uso indebido de su información personal, nos lo notifique sin dilación para poder adoptar las acciones pertinentes que proceda llevar a cabo.</p>
                <p>Asimismo, para garantizar que los datos que tenemos son correctos y se encuentran actualizados, le rogamos que, si se produce alguna modificación en sus datos, o si, por cualquier motivo, detecta que tenemos algún dato suyo incorrecto, nos lo comunique a la mayor brevedad para proceder a la oportuna subsanación.</p>

                <h3 className="text-lg font-semibold text-slate-100 mt-4">6. Medidas de seguridad</h3>
                <p>GRUPO INFINITY adopta los niveles de seguridad requeridos por el RGPD adecuados a la naturaleza de los datos que son objeto de tratamiento en cada momento. No obstante lo anterior, el/los “Usuario/s” debe tener en cuenta que la seguridad de los sistemas no es inexpugnable y pueden existir actuaciones dolosas de terceros, si bien GRUPO INFINITY pone todos los medios a su alcance para evitar dichas actuaciones. Puede solicitar mayor información acerca de nuestras medidas de seguridad al email info@melenamarketing.com.</p>
            </div>

            <div className="flex justify-end gap-4 pt-6">
                <button type="button" onClick={onClose} className="px-6 py-2 font-semibold text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all">
                    Cerrar
                </button>
            </div>
        </div>
    );
};
