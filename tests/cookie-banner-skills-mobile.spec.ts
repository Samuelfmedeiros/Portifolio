import { test, expect } from '@playwright/test'

/**
 * Regressão do gap de UI de 26/11/2026: a barra de cookies é `fixed bottom-0`
 * e, no primeiro viewport mobile, cobria a linha "NÍVEL"/"Level" dos cards de
 * habilidades — informação REAL escondida por overlay (provado com
 * `elementFromPoint` batendo no banner).
 *
 * Contrato medido e não suposto:
 *  - mobile 390x844, em cima da página (scrollY=0), o banner NÃO está no ar
 *    (revelação atrasada) e o ponto do texto do nível pertence ao card;
 *  - com UM salto para o fim do documento (tecla End / flick / scroll
 *    instantâneo), a reserva de altura em `--cookie-banner-h` nasce junto com
 *    a barra e o scroll acompanha — as 2 últimas linhas do footer ficam ACIMA
 *    da barra, não embaixo (era o segundo vício medido: 114px de atraso);
 *  - o conteúdo do banner vive dentro de um landmark nomeado (cura do axe
 *    `region` moderate que esta rodada mediu em 4 viewports);
 *  - desktop 1280x720 não regrediu: banner não nasce cobrindo conteúdo.
 */

const MOBILE = { width: 390, height: 844 }
const DESKTOP = { width: 1280, height: 720 }
const BANNER = '[data-testid="cookie-banner"]'

/** Consentimento ainda não dado: primeira visita, sem localStorage. */
async function semConsentimento(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    window.localStorage.removeItem('mc-analytics-consent')
  })
}

/**
 * A página usa `scroll-behavior: smooth` (globals.css): `scrollTo` vira
 * animação e a medição depende de sortear o tempo certo. Desligar o smooth
 * antes de cada salto torna o estado determinístico.
 */
async function scrollInstataneo(page: import('@playwright/test').Page, y: number) {
  await page.evaluate((alvo) => {
    document.documentElement.style.scrollBehavior = 'auto'
    window.scrollTo(0, alvo)
  }, y)
}

/** Salto para o fim do documento, com a barra já no ar e a reserva aplicada. */
async function irAoFim(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto'
  })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  // a barra entra no 1º evento de scroll (revelação atrasada) — sem esperar
  // pela attach, a consulta abaixo corre contra o DOM antigo.
  await page.waitForSelector(BANNER, { state: 'attached' })
  // a reserva nasce junto com a barra e o scroll acompanha: quando o fim é
  // atingido de verdade, scrollY cola no máximo do documento.
  await page.waitForFunction(() => {
    const doc = document.documentElement
    const h = getComputedStyle(doc).getPropertyValue('--cookie-banner-h').trim()
    return h.length > 0 && window.scrollY + window.innerHeight >= doc.scrollHeight - 2
  })
}

/** Textos cujo ponto central está sob a barra (prova por `elementFromPoint`). */
async function textosCobertos(page: import('@playwright/test').Page) {
  return page.evaluate((sel) => {
    const banner = document.querySelector(sel)
    if (!banner) return { temBanner: false, cobertos: [] as string[] }
    const alvos = Array.from(document.querySelectorAll('footer *, main *, section *')).filter(
      (el) => {
        if (el.closest(sel)) return false
        if (!(el.textContent ?? '').trim()) return false
        // só "folha de texto": elemento sem filhos com texto próprio
        return !Array.from(el.children).some((c) => (c.textContent ?? '').trim().length > 0)
      },
    )
    const cobertos: string[] = []
    for (const el of alvos) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      if (hit?.closest(sel)) cobertos.push((el.textContent ?? '').trim().slice(0, 40))
    }
    return { temBanner: true, cobertos }
  }, BANNER)
}

test.describe('cookie banner x cards de habilidades (mobile)', () => {
  test.use({ viewport: MOBILE })

  test('em scrollY=0 o texto do nível pertence ao card, não ao banner', async ({ page }) => {
    await semConsentimento(page)
    await page.goto('/')
    await page.waitForFunction(() => document.readyState === 'complete')

    // topo absoluto: é onde o gap foi medido originalmente
    await scrollInstataneo(page, 0)
    await page.waitForTimeout(150)

    const alvoNoCard = await page.evaluate(() => {
      const spans = Array.from(document.querySelectorAll('span, div, p')).filter((el) =>
        /^(N[ÍI]VEL|Level)$/i.test((el.textContent ?? '').trim()),
      )
      for (const el of spans) {
        const r = el.getBoundingClientRect()
        if (r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= window.innerHeight) {
          const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
          return {
            achou: true,
            texto: (el.textContent ?? '').trim(),
            noBanner: Boolean(hit?.closest('[data-testid="cookie-banner"]')),
          }
        }
      }
      return { achou: false, texto: '', noBanner: false }
    })

    expect(alvoNoCard.achou, 'tem algum texto de nível visível no viewport').toBe(true)
    expect(alvoNoCard.noBanner, 'o ponto do texto do nível NÃO pertence ao banner').toBe(false)
  })

  test('no fim da página a barra não cobre as últimas linhas do footer', async ({ page }) => {
    await semConsentimento(page)
    await page.goto('/')
    await page.waitForFunction(() => document.readyState === 'complete')
    await irAoFim(page)

    const medicao = await textosCobertos(page)
    expect(medicao.temBanner, 'o banner está no ar no fim da página').toBe(true)
    expect(medicao.cobertos, 'a barra não cobre texto de conteúdo').toEqual([])
  })

  test('o conteúdo do banner vive dentro de landmark nomeado', async ({ page }) => {
    await semConsentimento(page)
    await page.goto('/')
    await page.waitForFunction(() => document.readyState === 'complete')
    await irAoFim(page)

    const landmark = await page.evaluate((sel) => {
      const banner = document.querySelector(sel)
      if (!banner) return { existe: false, role: null, nome: '' }
      const regiao = banner.querySelector('[role="region"]')
      return {
        existe: Boolean(regiao),
        role: regiao?.getAttribute('role') ?? null,
        nome: regiao?.getAttribute('aria-label') ?? '',
      }
    }, BANNER)

    expect(landmark.existe).toBe(true)
    expect(landmark.role).toBe('region')
    expect(landmark.nome.length).toBeGreaterThan(0)
  })
})

test.describe('cookie banner (desktop)', () => {
  test.use({ viewport: DESKTOP })

  test('não nasce cobrindo conteúdo e reserva altura real', async ({ page }) => {
    await semConsentimento(page)
    await page.goto('/')
    await page.waitForFunction(() => document.readyState === 'complete')
    await scrollInstataneo(page, 0)
    await page.waitForTimeout(150)

    // em cima da página a barra não entra (revelação atrasada)
    const noTopo = await page.evaluate((sel) => Boolean(document.querySelector(sel)), BANNER)
    expect(noTopo).toBe(false)

    // depois do scroll ela aparece e publica a própria altura para o body
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto'
      window.scrollTo(0, document.body.scrollHeight)
    })
    await page.waitForSelector(BANNER, { state: 'attached' })
    await page.waitForFunction(() => {
      const doc = document.documentElement
      const h = getComputedStyle(doc).getPropertyValue('--cookie-banner-h').trim()
      return h.length > 0 && window.scrollY + window.innerHeight >= doc.scrollHeight - 2
    })
    const depois = await page.evaluate((sel) => ({
      temBanner: Boolean(document.querySelector(sel)),
      varH: getComputedStyle(document.documentElement).getPropertyValue('--cookie-banner-h').trim(),
      paddingBottom: getComputedStyle(document.body).paddingBottom,
    }), BANNER)
    expect(depois.temBanner).toBe(true)
    expect(depois.varH).toMatch(/^\d+(\.\d+)?px$/)
    expect(depois.paddingBottom).toBe(depois.varH)
  })
})