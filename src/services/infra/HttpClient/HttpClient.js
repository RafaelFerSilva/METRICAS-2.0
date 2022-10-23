// Arquitetura exagonal
//Ports e adapters

export async function HttpClient(fetchUrl, fetchOptions) {
  return fetch(fetchUrl, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : null,
  }).then(async (respostaServidor) => {
    return {
      ok: respostaServidor.ok,
      body: await respostaServidor.json(),
    };
  });
}
