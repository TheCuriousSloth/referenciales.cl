import { NextResponse, type NextRequest } from "next/server";
// Extender el tipo NextRequest para incluir la propiedad auth
interface AuthenticatedNextRequest extends NextRequest {/*...*/ }

const publicRoutes = ["/", "/prices"];
const authRoutes = ["/login", "/register"];
const apiAuthPrefix = "/api/auth";

// Función para verificar la autenticación (ejemplo básico)
const isAuthenticated = (req: AuthenticatedNextRequest): boolean => {
  try {
    // Verificar si el token de autenticación está presente en las cookies
    const token = req.cookies.get("next-auth.session-token");
    return !!token;
  } catch (error) {
    console.error("Error al verificar la autenticación:", error);
    return false;
  }
};

export default function middleware(req: AuthenticatedNextRequest) {
  try {
    const { nextUrl } = req;
    const isLoggedIn = isAuthenticated(req);
    console.log({ isLoggedIn, path: nextUrl.pathname });
    // Permitir todas las rutas de API de autenticación
    if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
      return NextResponse.next();
    }
    // Permitir acceso a rutas públicas sin importar el estado de autenticación
    if (publicRoutes.includes(nextUrl.pathname)) {
      return NextResponse.next();
    }
    // Redirigir a /dashboard si el usuario está logueado y trata de acceder a rutas de autenticación
    if (isLoggedIn && authRoutes.includes(nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    // Redirigir a /login si el usuario no está logueado y trata de acceder a una ruta protegida
    if (
      !isLoggedIn &&
      !authRoutes.includes(nextUrl.pathname) &&
      !publicRoutes.includes(nextUrl.pathname)
    ) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
  } catch (error) {
    console.error("Error en el middleware:", error);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};