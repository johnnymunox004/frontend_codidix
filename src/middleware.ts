import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define rutas públicas que no requieren autenticación
const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/services",
  "/contact",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

// Utiliza clerkMiddleware para verificar autenticación
export default clerkMiddleware(async (auth, request) => {
  // Si la ruta no es pública, protégela requiriendo autenticación
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Excluir archivos estáticos y rutas internas de Next.js
    "/((?!_next|.*\\..*|api/webhooks).*)",
    // Incluir la ruta raíz
    "/",
  ],
};
