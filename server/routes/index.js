import { Router } from 'express';
import categoriaRoutes   from './categoria.routes.js';
import productoRoutes    from './producto.routes.js';
import proveedorRoutes   from './proveedor.routes.js';
import compraRoutes      from './compra.routes.js';
import inventarioRoutes  from './inventario.routes.js';
import ventaRoutes       from './venta.routes.js';
import dashboardRoutes   from './dashboard.routes.js';
import reporteRoutes     from './reportes.routes.js';
import authRoutes        from './auth.routes.js';

const router = Router();

// ─── Autenticación (Login / Register) ─────────────────────────────────────────
router.use('/',            authRoutes);          // FASE 6: Autenticación refactorizada

// ─── Módulos existentes ───────────────────────────────────────────────────────
router.use('/categorias',  categoriaRoutes);
router.use('/productos',   productoRoutes);
router.use('/proveedores', proveedorRoutes);
router.use('/compras',     compraRoutes);

// ─── Módulos completados / nuevos ─────────────────────────────────────────────
router.use('/inventario',  inventarioRoutes);   // FASE 2: Inventario completo
router.use('/ventas',      ventaRoutes);         // FASE 3: Ventas
router.use('/dashboard',   dashboardRoutes);     // FASE 4: Dashboard global
router.use('/reportes',    reporteRoutes);       // FASE 5: Reportes analíticos

export default router;
