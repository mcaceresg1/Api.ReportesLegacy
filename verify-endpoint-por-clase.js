/**
 * Script de verificación para el endpoint de Libro Diario Clipper por Clase
 * Ejecutar con: node verify-endpoint-por-clase.js
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

// Clases a probar
const clases = [
  "COMPRAS",
  "VENTAS",
  "GASTOS",
  "INGRESOS",
  "PAGOS",
  "COBROS",
  "AJUSTES",
  "CIERRE",
  "APERTURA",
  "DIFERENCIAS",
];

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
          reject(new Error(`Error parsing JSON: ${error.message}`));
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

// Función para probar endpoint por clase
async function testEndpointPorClase(clase) {
  const path = `${config.basePath}/${config.bdClipperGPC}/${config.libro}/${config.mes}/comprobantes/clase/${clase}`;

  try {
    console.log(`\n🔍 Probando clase: ${clase}`);
    console.log(`   URL: http://${config.hostname}:${config.port}${path}`);

    const response = await makeRequest(path);

    if (response.statusCode === 200) {
      const data = response.data;
      console.log(`   ✅ Status: ${response.statusCode}`);
      console.log(`   ✅ Success: ${data.success}`);
      console.log(`   ✅ Message: ${data.message}`);
      console.log(`   ✅ Records: ${data.data ? data.data.length : 0}`);

      if (data.data && data.data.length > 0) {
        console.log(`   ✅ Sample record:`, {
          clase: data.data[0].clase,
          numeroComprobante: data.data[0].numeroComprobante,
          cuenta: data.data[0].cuenta,
          nombre: data.data[0].nombre,
        });
      }

      return {
        clase,
        success: true,
        statusCode: response.statusCode,
        recordCount: data.data ? data.data.length : 0,
        message: data.message,
      };
    } else {
      console.log(`   ❌ Status: ${response.statusCode}`);
      console.log(`   ❌ Error: ${response.data.message || "Unknown error"}`);

      return {
        clase,
        success: false,
        statusCode: response.statusCode,
        error: response.data.message || "Unknown error",
      };
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);

    return {
      clase,
      success: false,
      error: error.message,
    };
  }
}

// Función para probar endpoint general
async function testEndpointGeneral() {
  const path = `${config.basePath}/${config.bdClipperGPC}/${config.libro}/${config.mes}/comprobantes`;

  try {
    console.log(`\n🔍 Probando endpoint general`);
    console.log(`   URL: http://${config.hostname}:${config.port}${path}`);

    const response = await makeRequest(path);

    if (response.statusCode === 200) {
      const data = response.data;
      console.log(`   ✅ Status: ${response.statusCode}`);
      console.log(`   ✅ Success: ${data.success}`);
      console.log(`   ✅ Message: ${data.message}`);
      console.log(`   ✅ Records: ${data.data ? data.data.length : 0}`);

      return {
        success: true,
        statusCode: response.statusCode,
        recordCount: data.data ? data.data.length : 0,
        message: data.message,
      };
    } else {
      console.log(`   ❌ Status: ${response.statusCode}`);
      console.log(`   ❌ Error: ${response.data.message || "Unknown error"}`);

      return {
        success: false,
        statusCode: response.statusCode,
        error: response.data.message || "Unknown error",
      };
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);

    return {
      success: false,
      error: error.message,
    };
  }
}

// Función principal
async function main() {
  console.log(
    "🚀 Iniciando verificación del endpoint Libro Diario Clipper por Clase"
  );
  console.log(`📡 Servidor: http://${config.hostname}:${config.port}`);
  console.log(`📊 Base de datos: ${config.bdClipperGPC}`);
  console.log(`📚 Libro: ${config.libro}`);
  console.log(`📅 Mes: ${config.mes}`);

  const results = [];

  // Probar endpoint general primero
  console.log("\n" + "=".repeat(60));
  console.log("1. PROBANDO ENDPOINT GENERAL");
  console.log("=".repeat(60));

  const generalResult = await testEndpointGeneral();
  results.push({ type: "general", ...generalResult });

  // Probar endpoints por clase
  console.log("\n" + "=".repeat(60));
  console.log("2. PROBANDO ENDPOINTS POR CLASE");
  console.log("=".repeat(60));

  for (const clase of clases) {
    const result = await testEndpointPorClase(clase);
    results.push({ type: "clase", ...result });

    // Pequeña pausa entre requests
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Resumen de resultados
  console.log("\n" + "=".repeat(60));
  console.log("3. RESUMEN DE RESULTADOS");
  console.log("=".repeat(60));

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`✅ Exitosos: ${successful.length}`);
  console.log(`❌ Fallidos: ${failed.length}`);
  console.log(`📊 Total: ${results.length}`);

  if (successful.length > 0) {
    console.log("\n📋 Clases con datos:");
    successful.forEach((result) => {
      if (result.type === "clase" && result.recordCount > 0) {
        console.log(`   - ${result.clase}: ${result.recordCount} registros`);
      }
    });
  }

  if (failed.length > 0) {
    console.log("\n❌ Errores encontrados:");
    failed.forEach((result) => {
      if (result.type === "clase") {
        console.log(`   - ${result.clase}: ${result.error || "Unknown error"}`);
      } else {
        console.log(`   - General: ${result.error || "Unknown error"}`);
      }
    });
  }

  console.log("\n🎯 Verificación completada");
}

// Ejecutar script
main().catch(console.error);
