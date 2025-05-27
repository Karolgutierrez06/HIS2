document.getElementById('formSolicitudProcedimiento').addEventListener('submit', function(event) {
  event.preventDefault();

  // Obtener los valores del formulario
  const idPaciente               = document.getElementById('idPaciente').value;
  const nombrePaciente           = document.getElementById('nombrePaciente').value;
  const generoPaciente           = document.getElementById('generoPaciente').value;
  const nombreMedico             = document.getElementById('nombreMedico').value;
  const cedulaMedico             = document.getElementById('cedulaMedico').value;
  const codigoProcedimiento      = document.getElementById('codigoProcedimiento').value;
  const descripcionProcedimiento = document.getElementById('descripcionProcedimiento').value;
  const fechaSolicitud           = document.getElementById('fechaSolicitud').value;
  const prioridad                = document.getElementById('prioridad').value;

  // Convertir fecha a ISO 8601 (formato estándar de FHIR)
  const fechaISO = new Date(fechaSolicitud).toISOString();

  // Construir recurso FHIR ServiceRequest
  const fhirServiceRequest = {
    resourceType: "ServiceRequest",
    status: "active",
    intent: "order",
    priority: prioridad,
    code: {
      coding: [{
        system: "http://example.org/procedures-codes", // Cambiar por un sistema real si es necesario
        code: codigoProcedimiento,
        display: descripcionProcedimiento
      }]
    },
    subject: {
      reference: "Patient/" + idPaciente,
      display: nombrePaciente
    },
    authoredOn: fechaISO,
    requester: {
      reference: "Practitioner/" + cedulaMedico,
      display: nombreMedico
    }
  };

  console.log('FHIR ServiceRequest:', fhirServiceRequest);

  // Enviar al backend
  fetch('https://hl7-fhir-ehr-karol-1.onrender.com/service-request/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fhirServiceRequest)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud: ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    alert('Solicitud de procedimiento creada exitosamente. ID: ' + data.id);
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Hubo un error en la solicitud: ' + error.message);
  });
});
