import { describe, it, expect, vi, afterEach } from 'vitest'
import { parseFirstRssItem, getLatestLifelogPost } from './lifelogRss'

const VALID_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>LifeLog</title>
    <item>
      <title>O dashboard que encolheu 74%</title>
      <link>https://lifelog-sepia.vercel.app/post/capivara-dashboard/</link>
      <description>Conteúdo</description>
    </item>
    <item>
      <title>Segundo post</title>
      <link>https://lifelog-sepia.vercel.app/post/segundo/</link>
    </item>
  </channel>
</rss>`

const CDATA_RSS = `<rss version="2.0"><channel><item>
  <title><![CDATA[Post com <b>HTML</b> no título]]></title>
  <link><![CDATA[https://lifelog-sepia.vercel.app/post/cdata/]]></link>
</item></channel></rss>`

const XXE_RSS = `<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<rss><channel><item>
  <title>&xxe;</title>
  <link>https://evil.com</link>
</item></channel></rss>`

afterEach(() => {
  vi.restoreAllMocks()
})

describe('parseFirstRssItem', () => {
  it('extrai title e url do primeiro item', () => {
    const post = parseFirstRssItem(VALID_RSS)
    expect(post).toEqual({
      title: 'O dashboard que encolheu 74%',
      url: 'https://lifelog-sepia.vercel.app/post/capivara-dashboard/',
    })
  })

  it('ignora itens posteriores (só o primeiro)', () => {
    const post = parseFirstRssItem(VALID_RSS)
    expect(post?.title).not.toBe('Segundo post')
  })

  it('suporta CDATA em title e link', () => {
    const post = parseFirstRssItem(CDATA_RSS)
    expect(post?.title).toBe('Post com <b>HTML</b> no título')
    expect(post?.url).toBe('https://lifelog-sepia.vercel.app/post/cdata/')
  })

  it('remove DOCTYPE (proteção XXE) e retorna null se não acha item válido', () => {
    const post = parseFirstRssItem(XXE_RSS)
    expect(post).toBeNull()
  })

  it('retorna null para XML vazio/inválido', () => {
    expect(parseFirstRssItem('')).toBeNull()
    expect(parseFirstRssItem('não é xml')).toBeNull()
    expect(parseFirstRssItem(null as unknown as string)).toBeNull()
  })

  it('retorna null se link não é http(s)', () => {
    const rss = `<rss><channel><item><title>X</title><link>javascript:alert(1)</link></item></channel></rss>`
    expect(parseFirstRssItem(rss)).toBeNull()
  })

  it('retorna null se falta title ou link', () => {
    const noTitle = `<rss><channel><item><link>https://x.com</link></item></channel></rss>`
    const noLink = `<rss><channel><item><title>X</title></item></channel></rss>`
    expect(parseFirstRssItem(noTitle)).toBeNull()
    expect(parseFirstRssItem(noLink)).toBeNull()
  })
})

describe('getLatestLifelogPost', () => {
  it('retorna o post quando fetch é bem-sucedido', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: async () => VALID_RSS,
    }))
    const post = await getLatestLifelogPost()
    expect(post?.title).toBe('O dashboard que encolheu 74%')
    vi.unstubAllGlobals()
  })

  it('retorna null em erro HTTP', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    const post = await getLatestLifelogPost()
    expect(post).toBeNull()
    vi.unstubAllGlobals()
  })

  it('retorna null em falha de rede', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const post = await getLatestLifelogPost()
    expect(post).toBeNull()
    vi.unstubAllGlobals()
  })
})
