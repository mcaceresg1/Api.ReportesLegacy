/**
 * Script para probar el endpoint de comprobantes resumen
 * Ejecutar con: node test-endpoint-resumen.js
 */

const http = require("http");

// Configuración
const config = {
  hostname: "192.168.90.73",
  port: 3000,
  basePath: "/api/libro-diario-clipper",
  bdClipperGPC: "bdclipperGPC",
  libro: "D",
  mes: "08",
};

// Función para hacer petición HTTP
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: config.hostname,
      port: config.port,
      path: path,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            data: jsonData,
            headers: res.headers,
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: data,
            headers: res.headers,
          });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    req.end();
  });
}

// Función para probar endpoint de resumen
async function testEndpointResumen() {
  const path = `${config.basePath}/${config.bdClipperGPC}/${config.libro}/${config.mes}/comprobantes-resumen`;

  try {
    console.log("🔍 Probando endpoint de comprobantes resumen...");
    console.log(`   URL: http://${config.hostname}:${config.port}${path}`);

    const response = await makeRequest(path);

    if (response.statusCode === 200) {
      console.log("   ✅ Endpoint funcionando correctamente");
      const data = response.data;
      console.log(`   ✅ Success: ${data.success}`);
      console.log(`   ✅ Message: ${data.message}`);
      console.log(`   ✅ Records: ${data.data ? data.data.length : 0}`);

      if (data.data && data.data.length > 0) {
        console.log("   ✅ Sample records:");
        data.data.slice(0, 3).forEach((item, index) => {
          console.log(
            `      ${index + 1}. ${item.comprobante} - ${item.clase}`
          );
        });
      }
    } else {
      console.log(`   ❌ Error en endpoint: ${response.statusCode}`);
      console.log(`   ❌ Response: ${JSON.stringify(response.data, null, 2)}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

// Función para probar otros endpoints para comparar
async function testOtherEndpoints() {
  const endpoints = [
    `${config.basePath}/${config.bdClipperGPC}/${config.libro}/${config.mes}/comprobantes`,
    `${config.basePath}/${config.bdClipperGPC}/${config.libro}/${config.mes}/comprobantes-agrupados`,
    `${config.basePath}/${config.bdClipperGPC}/${config.libro}/${config.mes}/totales`,
  ];

  console.log("\n🔍 Probando otros endpoints para comparar...");

  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(endpoint);
      console.log(
        `   ${response.statusCode === 200 ? "✅" : "❌"} ${endpoint} - ${
          response.statusCode
        }`
      );
    } catch (error) {
      console.log(`   ❌ ${endpoint} - Error: ${error.message}`);
    }
  }
}

// Función principal
async function main() {
  console.log("🚀 Probando endpoint de comprobantes resumen");
  console.log(`📡 Servidor: http://${config.hostname}:${config.port}`);
  console.log(`📊 Base de datos: ${config.bdClipperGPC}`);
  console.log(`📚 Libro: ${config.libro}`);
  console.log(`📅 Mes: ${config.mes}`);

  await testEndpointResumen();
  await testOtherEndpoints();

  console.log("\n🎯 Prueba completada");
  console.log("\n📝 Si el endpoint sigue dando 404:");
  console.log("1. Verifica que el servidor esté reiniciado");
  console.log("2. Revisa los logs del servidor para errores");
  console.log("3. Confirma que la ruta esté correctamente registrada");
}

// Ejecutar script
main().catch(console.error);
