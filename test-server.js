const http = require("http");

// Función para hacer una petición HTTP
function makeRequest(path, method = "GET", data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "192.168.90.73",
      port: 3000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body,
        });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Función principal de prueba
async function testAPI() {
  console.log("🧪 Iniciando pruebas de la API...\n");

  try {
    // Test 1: Health check
    console.log("1️⃣ Probando health check...");
    const healthResponse = await makeRequest("/health");
    console.log(`   Status: ${healthResponse.statusCode}`);
    console.log(`   Response: ${healthResponse.body}\n`);

    // Test 2: Test endpoint
    console.log("2️⃣ Probando endpoint de test...");
    const testResponse = await makeRequest("/api/test");
    console.log(`   Status: ${testResponse.statusCode}`);
    console.log(`   Response: ${testResponse.body}\n`);

    // Test 3: Libro Diario OFICON Test endpoint
    console.log("3️⃣ Probando Libro Diario OFICON Test endpoint...");
    const libroDiarioTestResponse = await makeRequest(
      "/api/libro-diario-oficon/test"
    );
    console.log(`   Status: ${libroDiarioTestResponse.statusCode}`);
    console.log(`   Response: ${libroDiarioTestResponse.body}\n`);

    // Test 4: Libro Diario OFICON GET
    console.log("4️⃣ Probando Libro Diario OFICON GET...");
    const libroDiarioResponse = await makeRequest(
      "/api/libro-diario-oficon/generar-reporte?IDEMPRESA=12&FECHAINI=2003-01-01&FECHAFINAL=2003-01-31"
    );
    console.log(`   Status: ${libroDiarioResponse.statusCode}`);
    console.log(`   Response: ${libroDiarioResponse.body}\n`);
  } catch (error) {
    console.error("❌ Error en las pruebas:", error.message);
  }
}

// Ejecutar las pruebas
testAPI();
