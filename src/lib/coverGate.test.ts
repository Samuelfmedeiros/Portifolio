import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  parseStaticProjects,
  effectiveProjects,
  validateProjects,
  parseLiveCards,
  publicPath,
  MIN_BYTES,
} from "../../scripts/check-project-covers.mjs";

const ROOT = process.cwd();
const STATIC_SRC = readFileSync(path.join(ROOT, "src/lib/staticProjects.ts"), "utf8");
const ONLY_FALLBACK = { readSize: () => 99999 };

describe("check-project-covers — parser de STATIC_PROJECTS", () => {
  it("extrai nome, capa e video de cada projeto real", () => {
    const projects = parseStaticProjects(STATIC_SRC);
    expect(projects.length).toBeGreaterThanOrEqual(10);
    const names = projects.map((p) => p.name);
    for (const expected of ["DogWalk", "Arachne", "Portifolio", "lifelog", "storydesk"]) {
      expect(names).toContain(expected);
    }
    const dogwalk = projects.find((p) => p.name === "DogWalk");
    expect(dogwalk.imageUrl).toBe("/projects/seu.pet.webp");
    expect(dogwalk.videoUrl).toBe("/projects/seu-pet-scroll.mp4");
  });

  it("nao confunde o videoUrl de um projeto com a capa do seguinte", () => {
    const arachne = parseStaticProjects(STATIC_SRC).find((p) => p.name === "Arachne");
    expect(arachne.imageUrl).toBe("/projects/arachne.webp");
    expect(arachne.videoUrl).toBe("");
  });

  it("publicPath converte URL publica em caminho no repo", () => {
    expect(publicPath("/projects/x.webp")).toBe(path.join("public", "projects", "x.webp"));
    expect(publicPath("projects/x.webp")).toBe(path.join("public", "projects", "x.webp"));
  });
});

describe("check-project-covers — BLOQUEIA defeito nos arquivos deste commit", () => {
  it("acusa projeto de STATIC_PROJECTS sem imageUrl", () => {
    const projects = effectiveProjects({
      staticProjects: [{ name: "roger-mlops", imageUrl: "", videoUrl: "", source: "static" }],
    });
    const { blocking } = validateProjects(projects, ONLY_FALLBACK);
    expect(blocking).toHaveLength(1);
    expect(blocking[0].reason).toContain("sem imageUrl");
  });

  it("acusa capa referenciada mas ausente no repo", () => {
    const projects = [{ name: "fantasma", imageUrl: "/projects/fantasma.webp", videoUrl: "", source: "static" }];
    const { blocking } = validateProjects(projects, { readSize: () => null });
    expect(blocking[0].reason).toContain("ausente no repo");
  });

  it("acusa capa pequena demais (placeholder / arquivo truncado)", () => {
    const projects = [{ name: "toc", imageUrl: "/projects/toc.webp", videoUrl: "", source: "static" }];
    const { blocking } = validateProjects(projects, { readSize: () => MIN_BYTES - 1 });
    expect(blocking[0].reason).toContain("B (<");
  });

  it("acusa imageUrl que nao e imagem", () => {
    const projects = [{ name: "pdf", imageUrl: "/projects/doc.pdf", videoUrl: "", source: "static" }];
    const { blocking } = validateProjects(projects, ONLY_FALLBACK);
    expect(blocking[0].reason).toContain("nao e imagem");
  });

  it("acusa video ausente e video em formato inesperado", () => {
    const ausente = validateProjects(
      [{ name: "v", imageUrl: "/projects/a.webp", videoUrl: "/projects/v.mp4", source: "static" }],
      { readSize: (p) => (p.endsWith(".mp4") ? null : 99999) }
    );
    expect(ausente.blocking[0].reason).toContain("video ausente");

    const formato = validateProjects(
      [{ name: "v", imageUrl: "/projects/a.webp", videoUrl: "/projects/v.mkv", source: "static" }],
      ONLY_FALLBACK
    );
    expect(formato.blocking[0].reason).toContain("formato inesperado");
  });
});

describe("check-project-covers — NAO BLOQUEIA projeto novo (fora deste commit)", () => {
  it("repo que so existe na API sem capa vira sinal, nao bloqueio", () => {
    const projects = effectiveProjects({
      staticProjects: [{ name: "Arachne", imageUrl: "/projects/arachne.webp", videoUrl: "", source: "static" }],
      githubRepos: ["Arachne", "projeto-novo-sem-capa"],
    });
    const { blocking, advisory } = validateProjects(projects, ONLY_FALLBACK);
    expect(blocking).toEqual([]);
    expect(advisory.map((a) => a.name)).toEqual(["projeto-novo-sem-capa"]);
  });

  it("mas o MESMO projeto vira bloqueio se a entrada static ficou sem capa", () => {
    const projects = effectiveProjects({
      staticProjects: [{ name: "projeto-novo-sem-capa", imageUrl: "", videoUrl: "", source: "static" }],
      githubRepos: ["projeto-novo-sem-capa"],
    });
    const { blocking, advisory } = validateProjects(projects, ONLY_FALLBACK);
    expect(advisory).toEqual([]);
    expect(blocking.map((v) => v.name)).toEqual(["projeto-novo-sem-capa"]);
  });

  it("static tem precedencia sobre a API (como no merge da home)", () => {
    const projects = effectiveProjects({
      staticProjects: [{ name: "Arachne", imageUrl: "/projects/arachne.webp", videoUrl: "", source: "static" }],
      githubRepos: ["Arachne"],
    });
    expect(projects).toHaveLength(1);
    expect(projects[0].imageUrl).toBe("/projects/arachne.webp");
  });
});

describe("check-project-covers — sinal do HTML de producao (modo --live)", () => {
  it("detecta card no fallback e as capas referenciadas", () => {
    const html = `<div><svg data-testid="cover-fallback" data-cover-name="roger-mlops"></svg></div>
      <img src="/projects/arachne.webp" alt="Arachne">`;
    const { fallback, covers } = parseLiveCards(html);
    expect(fallback).toEqual(["roger-mlops"]);
    expect(covers).toEqual(["/projects/arachne.webp"]);
  });

  it("nao lista imagem fora de /projects/ como capa do hangar", () => {
    const html = `<img src="/avatar.png"><img src="/projects/storydesk.webp">`;
    expect(parseLiveCards(html).covers).toEqual(["/projects/storydesk.webp"]);
  });

  it("deduplica nome de fallback repetido no HTML", () => {
    const html = `<svg data-cover-name="x"></svg><svg data-cover-name="x"></svg><svg data-cover-name="y"></svg>`;
    expect(parseLiveCards(html).fallback).toEqual(["x", "y"]);
  });
});

describe("check-project-covers — controle positivo (estado real do repo)", () => {
  it("todo projeto de STATIC_PROJECTS tem capa real em public/", () => {
    const projects = parseStaticProjects(STATIC_SRC);
    const { blocking, checked } = validateProjects(projects, {
      publicDir: path.join(ROOT, "public"),
    });
    expect(checked).toBe(projects.length);
    expect(blocking).toEqual([]);
  });
});