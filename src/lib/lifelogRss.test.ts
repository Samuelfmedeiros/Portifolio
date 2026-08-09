import { describe, it, expect, vi, afterEach } from 'vitest'
import { parseRssItems, getLatestLifelogPosts } from './lifelogRss'

const VALID_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>LifeLog</title>
    <item>
      <title>O dashboard que encolheu 74%</title>
      <link>https://lifelog-sepia.vercel.app/post/capivara-dashboard/</link>
      <pubDate>Sat, 08 Aug 2026 19:00:00 GMT</pubDate>
      <description>O Dashboard do Capivara tinha 994 linhas.</description>
      <enclosure url="https://lifelog-sepia.vercel.app/covers/capivara.webp" type="image/webp" />
      <project>capivara</project>
      <accent>#f59e0b</accent>
    </item>
    <item>
      <title>O pool de conexões</title>
      <link>https://lifelog-sepia.vercel.app/post/arachne-pool/</link>
      <pubDate>Sat, 08 Aug 2026 15:00:00 GMT</pubDate>
      <description>O Arachne respondia 200.</description>
      <enclosure url="https://lifelog-sepia.vercel.app/covers/arachne-pool.webp" type="image/webp" />
      <project>arachne</project>
      <accent>#7c3aed</accent>
    </item>
    <item>
      <title>Post sem projeto</title>
      <link>https://lifelog-sepia.vercel.app/post/sem-projeto/</link>
      <pubDate>Fri, 07 Aug 2026 12:00:00 GMT</pubDate>
      <description>Sem metadata extra.</description>
    </item>
    <item>
      <title>Quarto (não deve aparecer com max=3)</title>
      <link>https://lifelog-sepia.vercel.app/post/quarto/</link>
    </item>
  </channel>
</rss>`

const CDATA_RSS = `<rss version="2.0"><channel><item>
  <title><![CDATA[Post com <b>HTML</b> no título]]></title>
  <link><![CDATA[https://lifelog-sepia.vercel.app/post/cdata/]]></link>
  <project><![CDATA[tatuengine]]></project>
  <accent><![CDATA[#14b8a6]]></accent>
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

describe('parseRssItems', () => {
  it('extrai title, url, date, excerpt, cover, project e accent', () => {
    const posts = parseRssItems(VALID_RSS, 3)
    expect(posts).toHaveLength(3)
    expect(posts[0]).toEqual({
      title: 'O dashboard que encolheu 74%',
      url: 'https://lifelog-sepia.vercel.app/post/capivara-dashboard/',
      date: 'Sat, 08 Aug 2026 19:00:00 GMT',
      excerpt: 'O Dashboard do Capivara tinha 994 linhas.',
      cover: 'https://lifelog-sepia.vercel.app/covers/capivara.webp',
      project: 'capivara',
      accent: '#f59e0b',
    })
  })

  it('respeita o limite max', () => {
    expect(parseRssItems(VALID_RSS, 1)).toHaveLength(1)
    expect(parseRssItems(VALID_RSS, 2)).toHaveLength(2)
  })

  it('suporta CDATA em title, link, project e accent', () => {
    const posts = parseRssItems(CDATA_RSS)
    expect(posts[0]?.title).toBe('Post com <b>HTML</b> no título')
    expect(posts[0]?.project).toBe('tatuengine')
    expect(posts[0]?.accent).toBe('#14b8a6')
  })

  it('remove DOCTYPE (proteção XXE) e descarta itens com entidades', () => {
    const posts = parseRssItems(XXE_RSS)
    expect(posts).toHaveLength(0)
  })

  it('retorna [] para XML vazio/inválido', () => {
    expect(parseRssItems('')).toEqual([])
    expect(parseRssItems('não é xml')).toEqual([])
    expect(parseRssItems(null as unknown as string)).toEqual([])
  })

  it('descarta item se link não é http(s)', () => {
    const rss = `<rss><channel><item><title>X</title><link>javascript:alert(1)</link></item></channel></rss>`
    expect(parseRssItems(rss)).toHaveLength(0)
  })

  it('descarta accent inválido (não-hex) mas mantém o post', () => {
    const rss = `<rss><channel><item><title>X</title><link>https://x.com</link><accent>url(evil)</accent></item></channel></rss>`
    const posts = parseRssItems(rss)
    expect(posts).toHaveLength(1)
    expect(posts[0]?.accent).toBeUndefined()
  })

  it('descarta cover não-http(s)', () => {
    const rss = `<rss><channel><item><title>X</title><link>https://x.com</link><enclosure url="javascript:alert(1)"/></item></channel></rss>`
    const posts = parseRssItems(rss)
    expect(posts[0]?.cover).toBeUndefined()
  })

  it('ignora posts sem title ou link', () => {
    const rss = `<rss><channel><item><link>https://x.com</link></item><item><title>ok</title><link>https://y.com</link></item></channel></rss>`
    expect(parseRssItems(rss)).toHaveLength(1)
  })
})

describe('getLatestLifelogPosts', () => {
  it('retorna posts quando fetch é bem-sucedido', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: async () => VALID_RSS,
    }))
    const posts = await getLatestLifelogPosts()
    // VALID_RSS tem 4 itens e MAX_POSTS agora é 8 (server busca mais p/ filtrar PT/EN)
    expect(posts).toHaveLength(4)
    expect(posts[0]?.project).toBe('capivara')
    vi.unstubAllGlobals()
  })

  it('retorna [] em erro HTTP', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    const posts = await getLatestLifelogPosts()
    expect(posts).toEqual([])
    vi.unstubAllGlobals()
  })

  it('retorna [] em falha de rede', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const posts = await getLatestLifelogPosts()
    expect(posts).toEqual([])
    vi.unstubAllGlobals()
  })
})
