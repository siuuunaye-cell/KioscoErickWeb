KIOSCO ERICK PWA

1) Subí todos estos archivos a la raíz de tu repositorio GitHub (incluidos config.js y nube.js).
2) GitHub: Settings > Pages > Deploy from a branch > main > /(root) > Save.
3) Esperá a que se publique el enlace HTTPS.
4) Abrilo en Chrome con internet una vez. En Chrome: menú ⋮ > Instalar aplicación o Agregar a pantalla principal.

Cuentas: la app pide usuario y contraseña (Supabase). Cada kiosco tiene sus datos en la nube y se sincronizan solos. Si el plan vence o la cuenta se suspende, se bloquea el acceso. La clave pública de Supabase va en config.js.

Funciones: productos, precios, costo, stock, ventas, historial, exportar CSV, copia/restauración JSON y caché offline.

Pitido al escanear: suena un beep (y vibra) al leer un producto registrado; tono grave si el código no existe o no hay stock. La cámara queda abierta para pasar varios productos seguidos.

Carga de productos con cámara: en Productos, 'Escanear código de barras' completa el código solo (si ya existe, carga sus datos). 'Guardar y escanear otro' guarda y abre la cámara para el siguiente.

Caja y ganancia: en Venta se elige el medio de pago (efectivo, transferencia, Mercado Pago, tarjeta) y en efectivo se ve el vuelto. La pestaña Caja muestra el total del día por medio de pago, la ganancia estimada y el cierre de caja.

Stock bajo y aumento masivo: aviso de stock bajo con lista para el proveedor; en Productos > Actualizar precios se sube o baja un % con redondeo y botón para deshacer.

Fiado: en Venta se elige Fiado y el nombre del cliente; la compra se suma a su cuenta (no entra a la caja). En la pestaña Fiados se ve cuánto debe cada uno, se registran pagos (que sí entran a la caja del día) y se manda la cuenta completa por WhatsApp.

Pan y fiambres: en Productos, 'Se vende por' Unidad o Kilo. Los productos por kilo piden gramos o pesos al agregarlos (ej: 250 g o $2.000), el precio es por kilo y el stock se lleva en kilos.

Nombre automático: al escanear un código nuevo en Productos (o con el botón 'Buscar el nombre con el código') la app busca el nombre en bases abiertas de internet (Open Food Facts y similares). Hay que revisarlo y completar precio y stock. Si no lo encuentra, se escribe a mano.

Cobro con QR de Mercado Pago: en Copias > Configurar Mercado Pago se conecta la cuenta del kiosco. Al elegir Mercado Pago y cobrar, se muestra un QR por el monto; cuando el cliente paga aparece APROBADO, suena un aviso y la venta se registra sola. Requiere la función mp-qr y las tablas mp_cuentas y cobros_qr en Supabase.
