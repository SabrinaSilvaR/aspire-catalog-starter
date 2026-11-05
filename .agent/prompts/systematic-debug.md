# Prompt: Depuración Sistemática (Systematic Debug)

Usa este prompt para guiar la resolución metódica de cualquier bug o fallo reportado:

## Instrucciones de Ejecución

1. **Evaluación**:
   - Muestra el mensaje de error o stack trace exacto.
   - Indica el archivo y la línea donde se origina la falla.
   - Describe el comportamiento esperado frente al observado.

2. **Reproducción**:
   - Corre el comando para reproducir el fallo:
     ```powershell
     npm --prefix frontend run test:run
     ```
   - Si no existe una prueba que evidencie el fallo, redáctala en el archivo `*.spec.tsx` correspondiente.

3. **Análisis de Causa Raíz**:
   - Plantea hasta 3 hipótesis fundamentadas.
   - Descarta aquellas que no coincidan con la traza de ejecución.
   - Identifica la línea o bloque exacto causante.

4. **Solución y Verificación**:
   - Aplica el cambio quirúrgico mínimo.
   - Re-ejecuta la prueba hasta obtener estado verde.
   - Confirma con `npm run build` y `npm run test:run`.
