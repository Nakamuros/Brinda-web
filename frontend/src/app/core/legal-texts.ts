/**
 * Términos y Condiciones y Política de Privacidad, generados desde los .docx de `docs/` (texto literal) con solo
 * las correcciones aprobadas por el usuario el 2026-11-25. No editar a mano sin el texto del asesor.
 * `**texto**` = negrita del documento original. La fecha de actualización NO va aquí: sale de
 * `LEGAL.documentsUpdatedAt` (vacía = no se muestra).
 */
export type LegalBlock = { kind: 'p'; text: string } | { kind: 'ul'; items: string[] };

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  title: string;
  sections: LegalSection[];
}

export const TERMS: LegalDocument = {
  "title": "Términos y Condiciones de Uso y Compra",
  "sections": [
    {
      "heading": "1. Quiénes somos y aceptación",
      "blocks": [
        {
          "kind": "p",
          "text": "El sitio web brindaperu.com (el \"Sitio\") es operado por **Brinda Perú S.A.C.**, con RUC 20616579607 y domicilio en Av. Alfredo Benavides 707, int. 1403, Miraflores (\"Brinda\", \"nosotros\"). Al navegar por el Sitio, agregar productos al carrito o solicitar un pedido, aceptas estos Términos y Condiciones y nuestra Política de Privacidad. Si no estás de acuerdo, te pedimos no usar el Sitio."
        }
      ]
    },
    {
      "heading": "2. Venta exclusiva a mayores de 18 años",
      "blocks": [
        {
          "kind": "p",
          "text": "La venta de bebidas alcohólicas a menores de 18 años está prohibida por la Ley N.º 28681. Al usar el Sitio declaras bajo juramento que eres mayor de 18 años."
        },
        {
          "kind": "ul",
          "items": [
            "Podemos pedirte DNI, carné de extranjería o pasaporte vigente al confirmar el pedido y al momento de la entrega.",
            "Si quien recibe el pedido no acredita ser mayor de edad, o presenta signos evidentes de ebriedad, **no entregaremos los productos**. En ese caso no habrá reentrega gratuita y los costos de envío no son reembolsables.",
            "Si detectamos que un pedido fue hecho por un menor, lo cancelaremos."
          ]
        },
        {
          "kind": "p",
          "text": "**Tomar bebidas alcohólicas en exceso es dañino.** Prohibida la venta de bebidas alcohólicas a menores de 18 años."
        }
      ]
    },
    {
      "heading": "3. Cómo funciona la compra",
      "blocks": [
        {
          "kind": "ul",
          "items": [
            "Eliges productos y los agregas al carrito en el Sitio.",
            "Al finalizar, el Sitio te dirige a nuestro WhatsApp con el detalle de tu pedido.",
            "Por WhatsApp confirmamos contigo la disponibilidad de stock, el precio final, la dirección de envío, el costo de delivery y el medio de pago.",
            "La compra se completa **solo cuando Brinda te confirma expresamente el pedido por WhatsApp** y se acredita el pago."
          ]
        },
        {
          "kind": "p",
          "text": "El carrito del Sitio es una solicitud de pedido, no una oferta vinculante ni una reserva de stock. Si un producto no está disponible, te ofreceremos un reemplazo, esperar su reposición o cancelar esa parte del pedido, sin costo alguno."
        }
      ]
    },
    {
      "heading": "4. Precios y pagos",
      "blocks": [
        {
          "kind": "ul",
          "items": [
            "Los precios están en soles (S/) e incluyen IGV y demás tributos aplicables, salvo que se indique lo contrario.",
            "Los precios y promociones del Sitio pueden cambiar sin previo aviso, pero el precio aplicable a tu pedido es el que te confirmemos por WhatsApp antes de pagar.",
            "Medios de pago aceptados: Yape, Plin o transferencia bancaria. Cada medio puede tener condiciones propias.",
            "Si hay un error evidente de precio, podemos corregirlo antes de confirmar; si no aceptas el precio correcto, cancelamos el pedido sin costo.",
            "Emitimos boleta o factura electrónica según corresponda. Para factura debes darnos tu RUC y razón social correctos."
          ]
        }
      ]
    },
    {
      "heading": "5. Entrega (delivery)",
      "blocks": [
        {
          "kind": "p",
          "text": "Entregamos únicamente en las zonas de reparto: La Victoria, Lima (Cercado de Lima), Lince, Magdalena del Mar, Miraflores, Pueblo Libre, San Borja, San Isidro, San Luis, San Miguel, Santiago de Surco y Surquillo. Fuera de ellas, consúltanos."
        },
        {
          "kind": "ul",
          "items": [
            "Horario de reparto: De martes a domingo. El plazo de entrega es estimado y depende de la zona, el tráfico y la disponibilidad; te lo informamos al confirmar el pedido.",
            "Debes brindar una dirección completa y exacta, con referencias, y un teléfono disponible. Si nadie recibe el pedido o la dirección es incorrecta, podemos reprogramar con un costo adicional de envío o cancelar el pedido.",
            "Revisa los productos al recibirlos, en presencia del repartidor, y avísanos de inmediato cualquier diferencia o daño evidente.",
            "Los riesgos sobre el producto pasan a ti desde la entrega.",
            "El delivery puede suspenderse temporalmente por caso fortuito o fuerza mayor (clima, paros, restricciones de las autoridades, entre otros)."
          ]
        }
      ]
    },
    {
      "heading": "6. Cambios, devoluciones y reclamos",
      "blocks": [
        {
          "kind": "ul",
          "items": [
            "Por la naturaleza de los productos, no aceptamos devoluciones ni cambios por simple arrepentimiento una vez entregado el pedido, salvo que la ley imperativa disponga otra cosa.",
            "Sí atendemos cambio, devolución o reembolso cuando el producto: (a) llegó dañado, roto o con el sello alterado, (b) no corresponde a lo pedido, o (c) está vencido o en mal estado.",
            "Para ello debes avisarnos por WhatsApp o al correo brindalicoreria@gmail.com dentro de 6 horas desde la entrega, con fotos del producto y del empaque, conservando el producto sin abrir cuando sea posible.",
            "Los reembolsos se hacen por el mismo medio de pago o el que acordemos, en un plazo máximo de 30 días hábiles desde que validamos el reclamo.",
            "Tienes derecho a presentar reclamos y quejas en nuestro **Libro de Reclamaciones virtual**, disponible en esta página web. También puedes acudir al INDECOPI."
          ]
        }
      ]
    },
    {
      "heading": "7. Obligaciones del usuario",
      "blocks": [
        {
          "kind": "p",
          "text": "Te comprometes a: dar información veraz; no usar el Sitio para fines ilícitos ni para comprar alcohol por encargo de menores de edad; no intentar vulnerar la seguridad del Sitio, ni copiar o extraer masivamente su contenido; y no suplantar la identidad de otra persona. Está prohibido revender los productos adquiridos a menores de edad."
        }
      ]
    },
    {
      "heading": "8. Disponibilidad del Sitio y responsabilidad",
      "blocks": [
        {
          "kind": "ul",
          "items": [
            "Procuramos que el Sitio funcione sin interrupciones, pero no garantizamos disponibilidad continua ni que esté libre de errores. Podemos modificar, suspender o retirar contenidos o funciones cuando sea necesario.",
            "Las imágenes de los productos son referenciales; la presentación, la añada, la cosecha o el diseño de etiqueta pueden variar según el lote del fabricante.",
            "No somos responsables por el consumo irresponsable de los productos, por el uso indebido que hagas de ellos, ni por daños derivados de causas ajenas a nuestro control, como fallas de internet, de WhatsApp o de servicios de terceros.",
            "Nada de lo dispuesto en estos Términos limita los derechos irrenunciables que te reconoce el Código de Protección y Defensa del Consumidor (Ley N.º 29571)."
          ]
        }
      ]
    },
    {
      "heading": "9. Propiedad intelectual",
      "blocks": [
        {
          "kind": "p",
          "text": "Los textos, imágenes, logotipos, marca \"Brinda\", diseños, videos y demás contenidos del Sitio son de Brinda o de sus licenciantes y están protegidos por las normas de propiedad intelectual. No puedes copiarlos, reproducirlos, modificarlos ni usarlos con fines comerciales sin nuestra autorización previa y por escrito. Las marcas de los licores que vendemos pertenecen a sus respectivos titulares y se muestran solo para identificar los productos."
        }
      ]
    },
    {
      "heading": "10. Enlaces y servicios de terceros",
      "blocks": [
        {
          "kind": "p",
          "text": "El Sitio puede contener enlaces o integraciones con terceros (por ejemplo, WhatsApp, redes sociales o medios de pago). Esos servicios se rigen por sus propios términos y políticas, y Brinda no es responsable por ellos."
        }
      ]
    },
    {
      "heading": "11. Modificaciones",
      "blocks": [
        {
          "kind": "p",
          "text": "Podemos actualizar estos Términos en cualquier momento. La versión vigente es la publicada en el Sitio, con su fecha de actualización. Los cambios no afectan los pedidos ya confirmados."
        }
      ]
    },
    {
      "heading": "12. Ley aplicable y solución de controversias",
      "blocks": [
        {
          "kind": "p",
          "text": "Estos Términos se rigen por las leyes de la República del Perú. Cualquier controversia se someterá a los jueces y tribunales competentes de Lima, sin perjuicio de tu derecho como consumidor de acudir ante el INDECOPI o ante la autoridad que corresponda."
        }
      ]
    },
    {
      "heading": "13. Contacto",
      "blocks": [
        {
          "kind": "p",
          "text": "Brinda Perú S.A.C. · RUC 20616579607 · Av. Alfredo Benavides 707, int. 1403, Miraflores · brindalicoreria@gmail.com · WhatsApp 939448967."
        }
      ]
    }
  ]
};

export const PRIVACY: LegalDocument = {
  "title": "Política de Privacidad y Protección de Datos Personales",
  "sections": [
    {
      "heading": "1. Responsable del tratamiento",
      "blocks": [
        {
          "kind": "p",
          "text": "**Brinda Perú S.A.C.**, RUC 20616579607, con domicilio en Av. Alfredo Benavides 707, int. 1403, Miraflores (\"Brinda\"), es titular del banco de datos personales donde se almacenan los datos que recogemos a través de brindaperu.com, WhatsApp y nuestras redes sociales. Tratamos tus datos conforme a la Ley N.º 29733, Ley de Protección de Datos Personales, y su Reglamento aprobado por el Decreto Supremo N.º 016-2024-JUS."
        }
      ]
    },
    {
      "heading": "2. Qué datos recogemos",
      "blocks": [
        {
          "kind": "ul",
          "items": [
            "**Datos de identificación y contacto:** nombres y apellidos, número de teléfono o WhatsApp, correo electrónico.",
            "**Datos de entrega:** dirección, distrito y referencias.",
            "**Datos para comprobantes y verificación de edad:** DNI, carné de extranjería o pasaporte, y RUC y razón social si pides factura. Solo los pedimos cuando son necesarios para emitir el comprobante o validar que eres mayor de 18 años.",
            "**Datos del pedido:** productos, montos, medio y constancia de pago. No almacenamos números completos de tarjetas.",
            "**Datos de navegación:** dirección IP, tipo de dispositivo y navegador, páginas visitadas y cookies (ver punto 8).",
            "**Datos de tus comunicaciones** con nosotros por WhatsApp, correo o redes sociales."
          ]
        },
        {
          "kind": "p",
          "text": "No recogemos datos sensibles ni datos de menores de edad. Si detectamos datos de un menor, los eliminaremos."
        }
      ]
    },
    {
      "heading": "3. Para qué usamos tus datos",
      "blocks": [
        {
          "kind": "p",
          "text": "Finalidades necesarias para atender tu pedido:"
        },
        {
          "kind": "ul",
          "items": [
            "Confirmar stock, precio, dirección y pago, y coordinar la entrega.",
            "Verificar que eres mayor de edad.",
            "Emitir boletas o facturas y cumplir obligaciones tributarias y legales.",
            "Atender consultas, reclamos y garantías, incluido el Libro de Reclamaciones.",
            "Prevenir fraudes y proteger la seguridad del Sitio."
          ]
        },
        {
          "kind": "p",
          "text": "Finalidades adicionales, solo si nos das tu consentimiento:"
        },
        {
          "kind": "ul",
          "items": [
            "Enviarte promociones, novedades y recomendaciones por WhatsApp, correo, SMS o redes sociales.",
            "Elaborar perfiles de compra para ofrecerte productos acordes a tus gustos.",
            "Realizar estadísticas y estudios de mejora de nuestro servicio."
          ]
        },
        {
          "kind": "p",
          "text": "Puedes rechazar las finalidades adicionales sin que ello afecte tu compra, y retirar tu consentimiento en cualquier momento escribiéndonos o usando la opción de baja de cada mensaje."
        }
      ]
    },
    {
      "heading": "4. Consentimiento",
      "blocks": [
        {
          "kind": "p",
          "text": "Al enviarnos tu pedido por el Sitio o por WhatsApp aceptas el tratamiento de tus datos para las finalidades necesarias. Para las finalidades adicionales, solicitaremos tu consentimiento por separado, de forma libre, previa, expresa, informada e inequívoca, por ejemplo mediante una casilla no premarcada."
        }
      ]
    },
    {
      "heading": "5. Con quién compartimos tus datos",
      "blocks": [
        {
          "kind": "p",
          "text": "No vendemos tus datos. Solo los compartimos cuando es necesario con:"
        },
        {
          "kind": "ul",
          "items": [
            "Repartidores o empresas de transporte, para entregar tu pedido.",
            "Proveedores de pago y entidades financieras, para procesar tu pago.",
            "Proveedores de tecnología: hosting y mantenimiento del Sitio, correo, analítica y WhatsApp (Meta Platforms).",
            "Asesores contables, legales y de facturación electrónica.",
            "Autoridades públicas, como la SUNAT, el INDECOPI o el Poder Judicial, cuando la ley lo exija."
          ]
        },
        {
          "kind": "p",
          "text": "Estos terceros solo pueden usar tus datos para prestarnos su servicio y están obligados a protegerlos."
        }
      ]
    },
    {
      "heading": "6. Transferencia al exterior",
      "blocks": [
        {
          "kind": "p",
          "text": "Algunos proveedores, como WhatsApp, redes sociales, servicios de hosting o analítica, pueden almacenar o procesar datos fuera del Perú. Antes de transferir tus datos, nos aseguramos de que el país receptor o el proveedor ofrezca un nivel adecuado de protección, o de contar con tu consentimiento cuando corresponda."
        }
      ]
    },
    {
      "heading": "7. Cuánto tiempo conservamos tus datos",
      "blocks": [
        {
          "kind": "p",
          "text": "Conservamos tus datos mientras mantengamos una relación comercial contigo y, luego, durante los plazos exigidos por la ley (por ejemplo, tributarios y de atención de reclamos). Los datos para fines promocionales se conservan hasta que retires tu consentimiento. Después los eliminamos o anonimizamos de forma segura."
        }
      ]
    },
    {
      "heading": "8. Cookies y tecnologías similares",
      "blocks": [
        {
          "kind": "p",
          "text": "El Sitio usa cookies para que funcione el carrito, recordar tus preferencias y medir el uso del Sitio. Puedes bloquearlas o eliminarlas desde la configuración de tu navegador; si lo haces, algunas funciones podrían no operar correctamente."
        }
      ]
    },
    {
      "heading": "9. Tus derechos",
      "blocks": [
        {
          "kind": "p",
          "text": "Como titular de tus datos puedes ejercer en cualquier momento tus derechos de **información, acceso, rectificación, cancelación o supresión, oposición, actualización, revocación del consentimiento, impedir el suministro de tus datos y tratamiento objetivo**."
        },
        {
          "kind": "p",
          "text": "Para ejercerlos, envía una solicitud a **brindalicoreria@gmail.com** indicando: tu nombre completo, copia de tu documento de identidad, el derecho que deseas ejercer y una descripción clara de tu solicitud. Responderemos dentro de los plazos que fija la normativa. Si consideras que no atendimos tu solicitud, puedes presentar un reclamo ante la **Autoridad Nacional de Protección de Datos Personales**, del Ministerio de Justicia y Derechos Humanos."
        }
      ]
    },
    {
      "heading": "10. Seguridad",
      "blocks": [
        {
          "kind": "p",
          "text": "Aplicamos medidas técnicas, organizativas y legales razonables para proteger tus datos contra pérdida, acceso no autorizado, alteración o uso indebido, y limitamos el acceso a quienes lo necesitan para su trabajo. Ningún sistema es totalmente infalible; si ocurre un incidente de seguridad que afecte tus datos, actuaremos conforme a la normativa vigente."
        }
      ]
    },
    {
      "heading": "11. Comunicaciones por WhatsApp y redes sociales",
      "blocks": [
        {
          "kind": "p",
          "text": "Las conversaciones por WhatsApp o redes sociales se rigen además por los términos y políticas de esas plataformas. Te recomendamos no enviarnos por esos canales datos de tarjetas, contraseñas ni información que no sea necesaria para tu pedido."
        }
      ]
    },
    {
      "heading": "12. Cambios a esta política",
      "blocks": [
        {
          "kind": "p",
          "text": "Podemos actualizar esta política cuando cambien nuestras prácticas o la ley. Publicaremos la versión vigente en el Sitio con su fecha. Si el cambio altera las finalidades para las que usamos tus datos, te pediremos un nuevo consentimiento."
        }
      ]
    },
    {
      "heading": "13. Contacto",
      "blocks": [
        {
          "kind": "p",
          "text": "Brinda Perú S.A.C. · Av. Alfredo Benavides 707, int. 1403, Miraflores · brindalicoreria@gmail.com · WhatsApp 939448967."
        }
      ]
    }
  ]
};
