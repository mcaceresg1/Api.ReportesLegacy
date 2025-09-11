/**
 * Script para verificar que el endpoint por clase aparezca en Swagger
 * Ejecutar con: node check-swagger-endpoint.js
 */

const http = require("http");

// Configuración
const config = {
  hostname: "192.168.90.73",
  port: 3000,
  swaggerPath: "/api-docs",
  testEndpoint:
    "/api/libro-diario-clipper/bdclipperGPC/D/08/comprobantes/clase/COMPRAS",
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
            data: data, // Retornar como texto si no es JSON
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

// Función para verificar Swagger
async function checkSwagger() {
  try {
    console.log("🔍 Verificando Swagger UI...");
    console.log(
      `   URL: http://${config.hostname}:${config.port}${config.swaggerPath}`
    );

    const response = await makeRequest(config.swaggerPath);

    if (response.statusCode === 200) {
      console.log("   ✅ Swagger UI accesible");

      // Buscar el endpoint por clase en la documentación
      const swaggerData = response.data;

      if (swaggerData && swaggerData.paths) {
        const endpointPath =
          "/api/libro-diario-clipper/{bdClipperGPC}/{libro}/{mes}/comprobantes/clase/{clase}";

        if (swaggerData.paths[endpointPath]) {
          console.log("   ✅ Endpoint por clase encontrado en Swagger");
          console.log(`   ✅ Path: ${endpointPath}`);

          const endpointInfo = swaggerData.paths[endpointPath];
          if (endpointInfo.get) {
            console.log("   ✅ Método GET documentado");
            console.log(`   ✅ Summary: ${endpointInfo.get.summary}`);
            console.log(
              `   ✅ Tags: ${
                endpointInfo.get.tags ? endpointInfo.get.tags.join(", ") : "N/A"
              }`
            );
          }
        } else {
          console.log("   ❌ Endpoint por clase NO encontrado en Swagger");
          console.log("   📋 Endpoints disponibles:");

          Object.keys(swaggerData.paths).forEach((path) => {
            if (path.includes("libro-diario-clipper")) {
              console.log(`      - ${path}`);
            }
          });
        }
      } else {
        console.log("   ❌ No se pudo parsear la documentación Swagger");
      }
    } else {
      console.log(`   ❌ Error accediendo a Swagger: ${response.statusCode}`);
      console.log(`   ❌ Response: ${response.data}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

// Función para probar el endpoint directamente
async function testEndpoint() {
  try {
    console.log("\n🔍 Probando endpoint directamente...");
    console.log(
      `   URL: http://${config.hostname}:${config.port}${config.testEndpoint}`
    );

    const response = await makeRequest(config.testEndpoint);

    if (response.statusCode === 200) {
      console.log("   ✅ Endpoint funcionando correctamente");
      const data = response.data;
      console.log(`   ✅ Success: ${data.success}`);
      console.log(`   ✅ Message: ${data.message}`);
      console.log(`   ✅ Records: ${data.data ? data.data.length : 0}`);
    } else {
      console.log(`   ❌ Error en endpoint: ${response.statusCode}`);
      console.log(`   ❌ Response: ${JSON.stringify(response.data, null, 2)}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

// Función para verificar rutas registradas
async function checkRoutes() {
  try {
    console.log("\n🔍 Verificando rutas registradas...");

    // Probar diferentes endpoints para ver cuáles responden
    const endpoints = [
      "/api/libro-diario-clipper/bdclipperGPC/D/08/comprobantes",
      "/api/libro-diario-clipper/bdclipperGPC/D/08/comprobantes/clase/COMPRAS",
      "/api/libro-diario-clipper/bdclipperGPC/D/08/comprobantes-agrupados",
      "/api/libro-diario-clipper/bdclipperGPC/D/08/totales",
    ];

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
  } catch (error) {
    console.log(`   ❌ Error verificando rutas: ${error.message}`);
  }
}

// Función principal
async function main() {
  console.log(
    "🚀 Verificando endpoint Libro Diario Clipper por Clase en Swagger"
  );
  console.log(`📡 Servidor: http://${config.hostname}:${config.port}`);

  await checkSwagger();
  await testEndpoint();
  await checkRoutes();

  console.log("\n🎯 Verificación completada");
  console.log("\n📝 Instrucciones:");
  console.log("1. Si el endpoint no aparece en Swagger, reinicia el servidor");
  console.log("2. Verifica que no haya errores en los logs del servidor");
  console.log(
    "3. Asegúrate de que el archivo de rutas esté correctamente configurado"
  );
  console.log(
    "4. Accede a http://192.168.90.73:3000/api-docs para ver Swagger UI"
  );
}

// Ejecutar script
main().catch(console.error);
