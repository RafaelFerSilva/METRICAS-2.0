import { authService } from "./authService";

export function withSession(funcao) {
  return async (ctx) => {
    try {
      await authService.getSession(ctx);
      const modifiedCtx = {
        ...ctx,
        req: {
          ...ctx.req,
          session: {
            name: "Dados de acesso",
          },
        },
      };
      return funcao(modifiedCtx);
    } catch (error) {
      return {
        redirect: {
          permanent: false,
          destination: "/?error=401",
        },
      };
    }
  };
}
