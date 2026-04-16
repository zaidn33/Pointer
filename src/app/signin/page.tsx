import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Sign in · Pointer",
};

export default function SignInPage() {
  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <SiteHeader variant="marketing" />
      <main className="flex-1 grid place-items-center px-6 py-16">
        <AuthForm mode="signin" />
      </main>
      <SiteFooter />
    </div>
  );
}
