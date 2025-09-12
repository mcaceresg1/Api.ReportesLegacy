const { Sequelize } = require('sequelize');

// Configuración de la base de datos (ajusta según tu configuración)
const exactusSequelize = new Sequelize({
  dialect: 'mssql',
  host: '192.168.90.73',
  port: 1433,
  database: 'JBRTRA',
  username: 'tu_usuario', // Reemplaza con tu usuario
  password: 'tu_password', // Reemplaza con tu password
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true
    }
  }
});

async function testDataGeneration() {
  try {
    console.log('🔍 Conectando a la base de datos...');
    await exactusSequelize.authenticate();
    console.log('✅ Conexión exitosa');

    // Verificar si existen datos en EGP
    console.log('🔍 Verificando datos existentes en EGP...');
    const [existingData] = await exactusSequelize.query(`
      SELECT COUNT(*) as TotalRegistros, TIPO, USUARIO
      FROM JBRTRA.EGP 
      WHERE USUARIO = 'ADMPQUES'
      GROUP BY TIPO, USUARIO
    `);
    
    console.log('📊 Datos existentes:', existingData);

    // Si no hay datos, ejecutar el script de generación
    if (existingData.length === 0 || existingData[0].TotalRegistros === 0) {
      console.log('⚠️ No hay datos en EGP. Ejecutando script de generación...');
      
      // Ejecutar el script SQL
      const fs = require('fs');
      const sqlScript = fs.readFileSync('./setup-estado-resultados-data.sql', 'utf8');
      
      // Dividir el script en queries individuales
      const queries = sqlScript.split(';').filter(q => q.trim());
      
      for (const query of queries) {
        if (query.trim()) {
          try {
            console.log('🔄 Ejecutando query...');
            await exactusSequelize.query(query);
            console.log('✅ Query ejecutado exitosamente');
          } catch (error) {
            console.error('❌ Error en query:', error.message);
          }
        }
      }
    } else {
      console.log('✅ Ya existen datos en EGP');
    }

    // Verificar datos después de la generación
    console.log('🔍 Verificando datos después de la generación...');
    const [finalData] = await exactusSequelize.query(`
      SELECT COUNT(*) as TotalRegistros, TIPO, USUARIO
      FROM JBRTRA.EGP 
      WHERE USUARIO = 'ADMPQUES'
      GROUP BY TIPO, USUARIO
    `);
    
    console.log('📊 Datos finales:', finalData);

    // Mostrar algunos registros de ejemplo de EGP
    const [sampleData] = await exactusSequelize.query(`
      SELECT TOP 10 * FROM JBRTRA.EGP 
      WHERE USUARIO = 'ADMPQUES' 
      ORDER BY PERIODO, TIPO, FAMILIA
    `);
    
    console.log('📋 Registros de ejemplo EGP:', sampleData);

    // Verificar datos en periodo_contable
    console.log('🔍 Verificando datos en periodo_contable...');
    const [periodosData] = await exactusSequelize.query(`
      SELECT COUNT(*) as TotalPeriodos, contabilidad, estado
      FROM JBRTRA.periodo_contable 
      GROUP BY contabilidad, estado
    `);
    
    console.log('📊 Períodos contables:', periodosData);

    // Verificar períodos para la fecha específica 2011-03-12
    const [periodoEspecifico] = await exactusSequelize.query(`
      SELECT * FROM JBRTRA.periodo_contable 
      WHERE fecha_final = '2011-03-12' 
        AND contabilidad = 'F'
    `);
    
    console.log('📅 Período para 2011-03-12:', periodoEspecifico);

    // Mostrar algunos períodos contables de ejemplo
    const [periodosEjemplo] = await exactusSequelize.query(`
      SELECT TOP 10 * FROM JBRTRA.periodo_contable 
      WHERE contabilidad = 'F' 
      ORDER BY fecha_final DESC
    `);
    
    console.log('📋 Períodos de ejemplo:', periodosEjemplo);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await exactusSequelize.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar el test
testDataGeneration();
