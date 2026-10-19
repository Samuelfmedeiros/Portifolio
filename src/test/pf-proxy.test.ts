import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/pf/[...path]/route";

/**
 * Contrato do proxy same-origin (/api/pf/...).
 *
 * Motivo do teste (14/09/2026): o dominio custom portifolio.seu.pet nao esta na
 * allowlist de CORS do Capivara, e o form de contato + o log de CV morriam com
 * "Failed to fetch" nesse dominio. A cura foi rotear pelo proprio Next. Este teste
 * trava (a) o encaminhamento correto, (b) a allowlist FECHADA — para alguem nao
 * "simplificar" a rota num proxy aberto — e (c) a propagacao do status do upstream.
 * (O prefixo umami/ foi retirado em 19/10/2026 — ver o teste de regressao abaixo.)
 */

function ctx(path: string[]) {
  return { params: Promise.resolve({ path }) };
}

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function req(url: string, init?: RequestInit) {
  return new NextRequest(url, init);
}

describe("proxy /api/pf/[...path]", () => {
  it("encaminha POST /portifolio/public/messages para o Capivara com o corpo", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    const res = await POST(
      req("http://localhost:3000/api/pf/portifolio/public/messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "a", email: "b@c.d", content: "x" }),
      }),
      ctx(["portifolio", "public", "messages"])
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [calledUrl, calledInit] = fetchMock.mock.calls[0];
    expect(String(calledUrl)).toBe(
      "https://capivara.seu.pet/api/portifolio/public/messages"
    );
    expect(calledInit.method).toBe("POST");
    expect(calledInit.body).toContain('"content":"x"');
    expect(res.status).toBe(200);
  });

  it("umami/ saiu da allowlist: 404 e ZERO fetch em POST e GET (regressao 19/10/2026)", async () => {
    const resPost = await POST(
      req("http://localhost:3000/api/pf/umami/api/send?x=1", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      }),
      ctx(["umami", "api", "send"])
    );
    expect(resPost.status).toBe(404);

    const resGet = await GET(
      req("http://localhost:3000/api/pf/umami/script.js?v=2"),
      ctx(["umami", "script.js"])
    );
    expect(resGet.status).toBe(404);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("NAO e proxy aberto: prefixo fora da allowlist = 404 e ZERO fetch", async () => {
    const res = await POST(
      req("http://localhost:3000/api/pf/auth/login", {
        method: "POST",
        body: "{}",
      }),
      ctx(["auth", "login"])
    );

    expect(res.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("bloqueia tambem o prefixo parecido (traversal / prefixo parcial)", async () => {
    for (const path of [
      ["portifolio", "admin"],
      ["portifolio/public/../admin"],
      ["portifolio/public/..", "admin"],
      ["portifolio", "public", "..", "admin"],
      ["umami"],
      // percent-encoding em loop — mesma classe do bypass do guard de PDF do CV
      ["portifolio/public/%2e%2e/admin"],
      ["portifolio/public/%252e%252e/admin"],
      ["portifolio%2fpublic%2f..%2fadmin"],
      ["umami/..%2fauth"],
      ["portifolio/public/messages%00"],
      ["portifolio\\public\\messages"],
    ]) {
      const res = await POST(
        req("http://localhost:3000/api/pf/" + path.join("/"), {
          method: "POST",
          body: "{}",
        }),
        ctx(path)
      );
      expect(res.status).toBe(404);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("propaga o status do upstream (422 de validacao continua 422)", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ detail: "erro" }), { status: 422 })
    );

    const res = await POST(
      req("http://localhost:3000/api/pf/portifolio/public/messages", {
        method: "POST",
        body: "{}",
      }),
      ctx(["portifolio", "public", "messages"])
    );

    expect(res.status).toBe(422);
  });

  it("upstream fora do ar = 502, nunca excecao nao tratada", async () => {
    fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

    const res = await POST(
      req("http://localhost:3000/api/pf/portifolio/public/events", {
        method: "POST",
        body: "{}",
      }),
      ctx(["portifolio", "public", "events"])
    );

    expect(res.status).toBe(502);
  });
});
