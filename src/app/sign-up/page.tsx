import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Crear Cuenta
        </h1>
        <p className="mt-2 text-center text-gray-600">
          Regístrate para empezar a usar nuestra aplicación
        </p>
      </div>
      <div className="w-full max-w-md">
        <SignUp
          routing="hash"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-indigo-600 hover:bg-indigo-700 text-sm normal-case",
              card: "rounded-xl shadow-md",
            },
          }}
        />
      </div>
    </div>
  );
}
