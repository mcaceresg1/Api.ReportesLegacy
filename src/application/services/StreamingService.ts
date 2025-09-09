import { Response } from "express";
import { Readable } from "stream";

export interface StreamingOptions {
  chunkSize?: number;
  delay?: number;
  onProgress?: (progress: {
    processed: number;
    total: number;
    percentage: number;
  }) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

export class StreamingService {
  /**
   * Convierte un array de datos en un stream JSON
   */
  static streamJsonArray<T>(
    data: T[],
    res: Response,
    options: StreamingOptions = {}
  ): void {
    const {
      chunkSize = 100,
      delay = 0,
      onProgress,
      onError,
      onComplete,
    } = options;

    let processed = 0;
    const total = data.length;

    // Configurar headers para streaming
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");

    // Crear stream personalizado
    const stream = new Readable({
      read() {
        // Implementación del método read
      },
    });

    // Manejar errores del stream
    stream.on("error", (error) => {
      console.error("❌ Error en stream:", error);
      if (onError) onError(error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Error en el streaming de datos",
          error: error.message,
        });
      }
    });

    // Conectar el stream a la respuesta
    stream.pipe(res);

    // Función para procesar datos en chunks
    const processChunk = async () => {
      try {
        const chunk = data.slice(processed, processed + chunkSize);

        if (chunk.length === 0) {
          // Fin de los datos
          stream.push("]");
          stream.push(null); // Finalizar stream

          if (onComplete) onComplete();
          return;
        }

        // Agregar separadores JSON apropiados
        if (processed === 0) {
          stream.push(
            '{"success":true,"message":"Datos obtenidos exitosamente","data":['
          );
        } else {
          stream.push(",");
        }

        // Agregar datos del chunk
        for (let i = 0; i < chunk.length; i++) {
          if (i > 0) stream.push(",");
          stream.push(JSON.stringify(chunk[i]));
        }

        processed += chunk.length;

        // Reportar progreso
        if (onProgress) {
          onProgress({
            processed,
            total,
            percentage: Math.round((processed / total) * 100),
          });
        }

        // Agregar delay si se especifica
        if (delay > 0) {
          setTimeout(processChunk, delay);
        } else {
          setImmediate(processChunk);
        }
      } catch (error) {
        console.error("❌ Error procesando chunk:", error);
        if (onError) onError(error as Error);
        stream.destroy(error as Error);
      }
    };

    // Iniciar el procesamiento
    processChunk();
  }

  /**
   * Stream de datos desde una función generadora
   */
  static async streamFromGenerator<T>(
    generator: AsyncGenerator<T>,
    res: Response,
    options: StreamingOptions = {}
  ): Promise<void> {
    const {
      chunkSize = 100,
      delay = 0,
      onProgress,
      onError,
      onComplete,
    } = options;

    let processed = 0;
    let isFirstChunk = true;

    // Configurar headers para streaming
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");

    // Crear stream personalizado
    const stream = new Readable({
      read() {
        // Implementación del método read
      },
    });

    // Manejar errores del stream
    stream.on("error", (error) => {
      console.error("❌ Error en stream:", error);
      if (onError) onError(error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Error en el streaming de datos",
          error: error.message,
        });
      }
    });

    // Conectar el stream a la respuesta
    stream.pipe(res);

    try {
      // Iniciar el JSON
      stream.push(
        '{"success":true,"message":"Datos obtenidos exitosamente","data":['
      );

      for await (const item of generator) {
        // Agregar separador si no es el primer elemento
        if (!isFirstChunk) {
          stream.push(",");
        }
        isFirstChunk = false;

        // Agregar el elemento
        stream.push(JSON.stringify(item));
        processed++;

        // Reportar progreso
        if (onProgress) {
          onProgress({
            processed,
            total: -1, // Total desconocido
            percentage: -1,
          });
        }

        // Agregar delay si se especifica
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      // Finalizar el JSON
      stream.push("]}");
      stream.push(null); // Finalizar stream

      if (onComplete) onComplete();
    } catch (error) {
      console.error("❌ Error en generador:", error);
      if (onError) onError(error as Error);
      stream.destroy(error as Error);
    }
  }

  /**
   * Stream de datos CSV
   */
  static streamCsv<T>(
    data: T[],
    res: Response,
    headers: string[],
    options: StreamingOptions = {}
  ): void {
    const {
      chunkSize = 100,
      delay = 0,
      onProgress,
      onError,
      onComplete,
    } = options;

    let processed = 0;
    const total = data.length;

    // Configurar headers para CSV
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="reporte.csv"');
    res.setHeader("Transfer-Encoding", "chunked");

    // Crear stream personalizado
    const stream = new Readable({
      read() {
        // Implementación del método read
      },
    });

    // Manejar errores del stream
    stream.on("error", (error) => {
      console.error("❌ Error en stream CSV:", error);
      if (onError) onError(error);
      if (!res.headersSent) {
        res.status(500).send("Error en el streaming de datos CSV");
      }
    });

    // Conectar el stream a la respuesta
    stream.pipe(res);

    // Función para procesar datos en chunks
    const processChunk = async () => {
      try {
        const chunk = data.slice(processed, processed + chunkSize);

        if (chunk.length === 0) {
          // Fin de los datos
          stream.push(null); // Finalizar stream

          if (onComplete) onComplete();
          return;
        }

        // Agregar headers CSV si es el primer chunk
        if (processed === 0) {
          stream.push(headers.join(",") + "\n");
        }

        // Agregar datos del chunk
        for (const item of chunk) {
          const row = headers
            .map((header) => {
              const value = (item as any)[header];
              // Escapar comillas y envolver en comillas si contiene comas
              const escapedValue = String(value || "").replace(/"/g, '""');
              return escapedValue.includes(",")
                ? `"${escapedValue}"`
                : escapedValue;
            })
            .join(",");

          stream.push(row + "\n");
        }

        processed += chunk.length;

        // Reportar progreso
        if (onProgress) {
          onProgress({
            processed,
            total,
            percentage: Math.round((processed / total) * 100),
          });
        }

        // Agregar delay si se especifica
        if (delay > 0) {
          setTimeout(processChunk, delay);
        } else {
          setImmediate(processChunk);
        }
      } catch (error) {
        console.error("❌ Error procesando chunk CSV:", error);
        if (onError) onError(error as Error);
        stream.destroy(error as Error);
      }
    };

    // Iniciar el procesamiento
    processChunk();
  }
}
