KIOSCO ERICK PWA

1) Subí todos estos archivos a la raíz de tu repositorio GitHub.
2) GitHub: Settings > Pages > Deploy from a branch > main > /(root) > Save.
3) Esperá a que se publique el enlace HTTPS.
4) Abrilo en Chrome con internet una vez; agregá un producto y esperá a que cargue.
5) Probá modo avión. En Chrome: menú ⋮ > Instalar aplicación o Agregar a pantalla principal.

Funciones: productos, precios, stock, ventas, historial, exportar CSV, copia/restauración JSON y caché offline. Los datos se guardan en ese dispositivo y no se sincronizan con otros teléfonos. Hacé copias periódicas.

La cámara necesita HTTPS y permiso. El escaneo automático usa BarcodeDetector, cuya disponibilidad depende de Chrome; si no está disponible, se puede escribir el código en el buscador.

Pitido al escanear: suena un beep (y vibra) cada vez que se lee un producto registrado; un tono grave si el código no existe o no hay stock. La cámara queda abierta para pasar varios productos seguidos; se cierra con el botón Cerrar cámara.

Carga de productos con cámara: en la pestaña Productos, 'Escanear código de barras' completa el código solo (si ya existe, carga sus datos para editar). 'Guardar y escanear otro' guarda y abre la cámara para el siguiente.
