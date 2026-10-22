// Copia del producto de bpa-backapp/src/data/smartmedic.product.ts.
// Se usa solo si la API no responde, para que la landing nunca muestre un error.
import type { Product } from '@/types/product'

export const fallbackProducts: Record<string, Product> = {
  smartmedic: {
  slug: "smartmedic",
  name: "SmartMedic",
  brand: {
    logoUrl: "/img/smartmedic-logo.png",
    iconUrl: "/img/smartmedic-icon.png",
    primaryColor: "#0270B4",
    accentColor: "#EE8B05",
  },
  hero: {
    eyebrow: "Software médico y odontológico",
    title: "Administrar tu clínica",
    highlight: "nunca fue tan fácil",
    subtitle:
      "Agenda, historia clínica, recetas, facturación electrónica y recordatorios por WhatsApp. Todo lo que necesitas en una sola plataforma, desde cualquier dispositivo.",
    // Video en producción. Pegar aquí la URL de YouTube/Vimeo o el MP4 cuando esté listo.
    videoUrl: "",
    posterUrl: "/img/sistema-general.webp",
  },
  stats: [
    { value: "+300", label: "profesionales ya usan SmartMedic" },
    { value: "300%", label: "más rapidez entre consultas" },
    { value: "20%", label: "más pacientes recurrentes" },
  ],
  features: [
    {
      icon: "fa-notes-medical",
      title: "Historia clínica digital",
      description:
        "Datos personales, signos vitales, diagnósticos, tratamientos, exámenes y documentos de cada paciente, con su historial de atenciones.",
    },
    {
      icon: "fa-calendar-check",
      title: "Agenda digital",
      description:
        "Gestiona horarios y citas en tiempo real, busca por paciente o doctor y envía recordatorios automáticos por WhatsApp y email.",
    },
    {
      icon: "fa-file-prescription",
      title: "Recetas y certificados",
      description:
        "Emite recetas, órdenes de exámenes y certificados médicos con plantillas listas para tus planes de tratamiento.",
    },
    {
      icon: "fa-tooth",
      title: "Odontograma digital",
      description:
        "Gráfico dental con el historial de tratamientos y diagnósticos específicos de cada pieza.",
    },
    {
      icon: "fa-file-invoice-dollar",
      title: "Facturación y pagos",
      description:
        "Facturación electrónica con envío automático, control de abonos, pagos de tratamientos y pagos a médicos.",
    },
    {
      icon: "fa-user-shield",
      title: "Roles para tu equipo",
      description:
        "Administrador, médico y asistente: cada miembro de tu centro médico ve y hace solo lo que le corresponde.",
    },
  ],
  includes: [
    "Gestión de pacientes",
    "Gestión de citas y admisiones",
    "Agenda de trabajo",
    "Registro de signos vitales",
    "Historia clínica electrónica",
    "Consentimientos informados",
    "Procedimientos médicos",
    "Exámenes patológicos",
    "Recetas, órdenes de exámenes y certificados",
    "Plantillas de tratamiento y recetas",
    "Adjuntar imágenes y PDF",
    "Historial de atenciones médicas",
    "Recordatorios por email y WhatsApp",
    "Módulo de facturación electrónica",
    "Envío automático de facturas",
    "Control de abonos y pagos",
    "Asesoría para tu firma electrónica",
    "Almacenamiento de 10 GB",
    "Implementación y migración de tus datos",
    "Capacitación personalizada",
    "Soporte técnico",
    "Actualizaciones periódicas",
  ],
  gallery: [
    { src: "/img/web.webp", alt: "Listado de pacientes en SmartMedic desde el computador" },
    { src: "/img/tablet.webp", alt: "Agenda de citas de SmartMedic en tablet" },
    { src: "/img/telefono.webp", alt: "SmartMedic desde el celular" },
  ],
  support:
    "Soporte presencial en Guayaquil y virtual en todo el país, de lunes a viernes de 9h30 a 17h30.",
  // Precios oficiales del flyer "Cuenta y Precios 2026" (oct 2026).
  plans: [
    {
      id: "mensual",
      name: "Plan mensual",
      period: "month",
      note: "Pagas mes a mes, sin permanencia.",
    },
    {
      id: "anual",
      name: "Plan anual",
      period: "year",
      note: "Un solo pago por todo el año, con descuento incluido.",
      badge: "Ahorra hasta 5%",
      highlighted: true,
    },
  ],
  tiers: [
    {
      id: "individual",
      name: "Plan Individual",
      minSeats: 1,
      maxSeats: 1,
      priceCents: { month: 2000, year: 23500 },
    },
    {
      id: "consultorio",
      name: "Plan Consultorio",
      minSeats: 2,
      maxSeats: 4,
      priceCents: { month: 5000, year: 58800 },
    },
    {
      id: "clinica",
      name: "Plan Clínica",
      minSeats: 5,
      maxSeats: 10,
      priceCents: { month: 8000, year: 91200 },
    },
  ],
  overflow: { fromSeats: 11, perSeatCents: { month: 1000, year: 10800 } },
  taxRate: 0.15,
  maxSeats: 30,
  trustedBy: ["PAX", "SEGUA Dental", "Orto Novus", "Smile", "Med Plus", "Vida Dental", "Doctorisy"],
  faqs: [
    {
      question: "¿Qué pasa después de pagar?",
      answer:
        "Recibes la confirmación al instante y nuestro equipo te escribe por WhatsApp para crear tu cuenta y agendar tu capacitación.",
    },
    {
      question: "¿El precio es por clínica o por profesional?",
      answer:
        "Depende de cuántos profesionales usarán el sistema: Plan Individual (1 usuario), Plan Consultorio (2 a 4) y Plan Clínica (5 a 10). Para más de 10 usuarios el valor es de $10 por usuario al mes o $108 por usuario al año.",
    },
    {
      question: "¿Sirve para odontología?",
      answer: "Sí. SmartMedic incluye odontograma digital y está pensado para consultorios médicos y odontológicos.",
    },
    {
      question: "¿Necesito instalar algo?",
      answer: "No. Funciona en la nube y entras desde tu computador, tablet o celular.",
    },
    {
      question: "¿Puedo pedir funciones a la medida?",
      answer:
        "Sí. SmartMedic es desarrollado por BPA, así que podemos crear módulos personalizados por un valor adicional.",
    },
  ],
  whatsapp: "593995640953",
  },
};
