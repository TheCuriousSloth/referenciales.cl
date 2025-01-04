// app/(auth)/login/page.tsx
"use client";

import { SessionProvider, useSession, signIn } from 'next-auth/react';
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { LoaderCircle } from "lucide-react";

const ERROR_MESSAGES = {
  AccessDenied: "No tienes permiso para acceder a esta aplicación.",
  OAuthSignin: "Ocurrió un error durante el inicio de sesión con Google.",
  default: "Ocurrió un error durante el inicio de sesión."
} as const;

const LoadingFallback = () => (
  <div className="min-h-screen flex justify-center items-center">
    <LoaderCircle className="h-6 w-6 animate-spin" />
  </div>
);

const LoginPageContent = () => {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleError = useCallback((error: string) => {
    return ERROR_MESSAGES[error as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.default;
  }, []);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setError(handleError(error));
    }
  }, [searchParams, handleError]);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleGoogleLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: false,
        prompt: "select_account",
      });

      if (result?.error) {
        setError(handleError(result.error));
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Ocurrió un error inesperado. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }, [router, handleError]);

  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8 bg-gray-50">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-center">
            Bienvenido a Referenciales.cl
          </CardTitle>
          <CardDescription className="text-center">
            Ingrese con su cuenta de Google para acceder
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
            disabled={isLoading}
            onClick={handleGoogleLogin}
            type="button"
          >
            {!isLoading && (
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {isLoading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Conectando...
              </>
            ) : (
              "Continuar con Google"
            )}
          </Button>
        </CardContent>

        <CardFooter className="text-center text-sm text-gray-500">
          <p className="w-full">
            Al continuar, aceptas nuestros{" "}
            <a href="/terms" className="text-primary hover:underline">
              Términos de Servicio
            </a>{" "}
            y{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Política de Privacidad
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

const LoginPage: React.FC = () => {
  return (
    <SessionProvider>
      <Suspense fallback={<LoadingFallback />}>
        <LoginPageContent />
      </Suspense>
    </SessionProvider>
  );
};

export default LoginPage;