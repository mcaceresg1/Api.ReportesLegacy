const axios = require('axios');

// Configuración
const API_BASE_URL = 'http://localhost:3000/api';
const CONJUNTO = 'ASFSAC'; // Cambiar por el conjunto que tengas disponible
const CENTRO_COSTO = '01'; // Cambiar por un centro de costo válido

async function testCuentasContables() {
  try {
    console.log('🧪 Iniciando pruebas de cuentas contables...\n');

    // 1. Probar obtener filtros de centros de costo
    console.log('1️⃣ Probando obtener filtros de centros de costo...');
    try {
      const response = await axios.get(`${API_BASE_URL}/reporte-cuenta-contable/${CONJUNTO}/filtro-centros-costo`);
      console.log('✅ Filtros de centros de costo obtenidos:', response.data.data?.length || 0, 'registros');
      if (response.data.data && response.data.data.length > 0) {
        console.log('   Primer centro de costo:', response.data.data[0]);
      }
    } catch (error) {
      console.log('❌ Error al obtener filtros de centros de costo:', error.response?.data || error.message);
    }

    // 2. Probar obtener cuentas contables
    console.log('\n2️⃣ Probando obtener cuentas contables...');
    try {
      const response = await axios.get(`${API_BASE_URL}/reporte-cuenta-contable/${CONJUNTO}/cuentas-contables/${CENTRO_COSTO}?page=1&limit=10`);
      console.log('✅ Cuentas contables obtenidas:', response.data.data?.length || 0, 'registros');
      console.log('   Total de registros:', response.data.pagination?.total || response.data.total || 0);
      if (response.data.data && response.data.data.length > 0) {
        console.log('   Primera cuenta contable:', response.data.data[0]);
      }
    } catch (error) {
      console.log('❌ Error al obtener cuentas contables:', error.response?.data || error.message);
    }

    // 3. Probar exportar a Excel
    console.log('\n3️⃣ Probando exportar a Excel...');
    try {
      const response = await axios.post(`${API_BASE_URL}/reporte-cuenta-contable/${CONJUNTO}/cuentas-contables/${CENTRO_COSTO}/exportar-excel`, {}, {
        responseType: 'arraybuffer'
      });
      
      console.log('✅ Excel exportado exitosamente');
      console.log('   Tamaño del archivo:', response.data.length, 'bytes');
      console.log('   Content-Type:', response.headers['content-type']);
      
      // Guardar el archivo para verificar
      const fs = require('fs');
      const filename = `test-cuentas-contables-${CONJUNTO}-${CENTRO_COSTO}-${new Date().toISOString().split('T')[0]}.xlsx`;
      fs.writeFileSync(filename, response.data);
      console.log(`   Archivo guardado como: ${filename}`);
      
    } catch (error) {
      console.log('❌ Error al exportar Excel:', error.response?.data || error.message);
    }

    console.log('\n🎉 Pruebas completadas');

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

// Ejecutar las pruebas
testCuentasContables();
