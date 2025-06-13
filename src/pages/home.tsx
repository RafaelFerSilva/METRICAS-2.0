import { withSession } from "../services/auth/session";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para o dashboard
    router.replace('/dashboard');
  }, [router]);

  return null; // Não renderiza nada, apenas redireciona
}

// Decorator Pattern
export const getServerSideProps = withSession((ctx: any) => {
  return {
    props: {
      session: ctx.req.session,
    },
  };
});
