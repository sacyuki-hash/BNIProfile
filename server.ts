import express from 'express';
import type { Request, Response } from 'express';
import * as cheerio from 'cheerio';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ParsedProfile, KeyValuePair, ContactCircleItem, OneToOneItem } from './src/types/profile.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Helper to extract clean text while preserving newlines for <br>
function getCleanText($: cheerio.CheerioAPI, el: any): string {
  if (!el) return '';
  const clone = $(el).clone();
  clone.find('br').replaceWith('\n');
  return clone.text().trim();
}

// Clean helper to extract URL or ID
function normalizeTargetUrl(input: string): { url: string; id: string } {
  let cleaned = input.trim();
  
  // If it's already an id parameter
  if (cleaned.startsWith('share?id=')) {
    cleaned = cleaned.substring('share?id='.length);
  } else if (cleaned.startsWith('?id=')) {
    cleaned = cleaned.substring('?id='.length);
  } else if (cleaned.startsWith('id=')) {
    cleaned = cleaned.substring('id='.length);
  }

  // If it is a full URL
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    try {
      const parsedUrl = new URL(cleaned);
      const idParam = parsedUrl.searchParams.get('id');
      if (idParam) {
        return {
          url: `https://ne101.ncas.jp/bni_meibo/share?id=${encodeURIComponent(idParam)}`,
          id: idParam,
        };
      }
      return { url: cleaned, id: '' };
    } catch {
      // fallback
    }
  }

  // Treat cleaned as raw id
  // Note: if user copied an already URL-encoded ID (or unencoded JSON), decode first if possible
  let rawId = cleaned;
  try {
    if (rawId.includes('%')) {
      rawId = decodeURIComponent(rawId);
    }
  } catch {
    // keep rawId
  }

  return {
    url: `https://ne101.ncas.jp/bni_meibo/share?id=${encodeURIComponent(rawId)}`,
    id: rawId,
  };
}

// GET /api/parse-profile
app.get('/api/parse-profile', async (req: Request, res: Response) => {
  const queryInput = (req.query.url as string) || (req.query.id as string);
  if (!queryInput) {
    return res.status(400).json({ error: 'URLまたはIDパラメータを指定してください' });
  }

  const { url: targetUrl, id } = normalizeTargetUrl(queryInput);

  try {
    const fetchResponse = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
      },
    });

    if (!fetchResponse.ok) {
      return res.status(fetchResponse.status).json({
        error: `データ取得に失敗しました (ステータス: ${fetchResponse.status})`,
      });
    }

    const html = await fetchResponse.text();
    const $ = cheerio.load(html);

    // Verify if page loaded valid profile
    const rawTitle = $('h3 span').first().text().trim() || $('title').text().trim();
    if (!rawTitle && !$('table').length) {
      return res.status(404).json({ error: 'プロフィール情報が見つかりませんでした' });
    }

    // Extract photos and meishi cards
    let photoUrl: string | undefined;
    let meishiOmoteUrl: string | undefined;
    let meishiUraUrl: string | undefined;

    $('img.gazo').each((_, el) => {
      const src = $(el).attr('src')?.trim();
      if (!src) return;

      const fullSrc = src.startsWith('http') ? src : `https://ne101.ncas.jp${src.startsWith('/') ? '' : '/'}${src}`;

      if (fullSrc.includes('photo')) {
        photoUrl = fullSrc;
      } else if (fullSrc.includes('meishi_omote')) {
        meishiOmoteUrl = fullSrc;
      } else if (fullSrc.includes('meishi_ura')) {
        meishiUraUrl = fullSrc;
      } else if (!photoUrl) {
        photoUrl = fullSrc;
      } else if (!meishiOmoteUrl) {
        meishiOmoteUrl = fullSrc;
      }
    });

    // Helper to extract key-value table
    const parseTable = (tableEl: any): KeyValuePair[] => {
      const pairs: KeyValuePair[] = [];
      $(tableEl)
        .find('tr')
        .each((_, row) => {
          const cells = $(row).find('td');
          if (cells.length >= 2) {
            const label = $(cells[0]).text().trim();
            const value = getCleanText($, cells[1]);
            if (label) {
              pairs.push({ label, value });
            }
          }
        });
      return pairs;
    };

    // Helper to get map of labels
    const pairsToMap = (pairs: KeyValuePair[]): Record<string, string> => {
      const map: Record<string, string> = {};
      pairs.forEach((p) => {
        map[p.label] = p.value;
      });
      return map;
    };

    // 1. Basic Tab
    const basicTab = $('[data-tab="basic"]');
    const memberRows: KeyValuePair[] = [];
    const businessRows: KeyValuePair[] = [];

    // Parse tables in basic tab
    basicTab.find('table').each((index, tbl) => {
      const pairs = parseTable(tbl);
      if (index === 0) {
        memberRows.push(...pairs);
      } else {
        businessRows.push(...pairs);
      }
    });

    const memberMap = pairsToMap(memberRows);
    const businessMap = pairsToMap(businessRows);

    // Extract Links from business section
    let website: { text: string; url: string } | undefined;
    let facebook: { text: string; url: string } | undefined;
    const otherLinks: Array<{ text: string; url: string }> = [];

    basicTab.find('a').each((_, a) => {
      const href = $(a).attr('href')?.trim();
      const text = $(a).text().trim();
      if (!href || href === '#') return;

      if (href.includes('facebook.com')) {
        facebook = { text: text || 'Facebook', url: href };
      } else if (!website) {
        website = { text: text || href, url: href };
      } else {
        otherLinks.push({ text: text || href, url: href });
      }
    });

    // Address & Postal code split
    const rawAddress = businessMap['郵便番号・住所'] || '';
    const postalMatch = rawAddress.match(/(\d{3}-\d{4})/);
    const postalCode = postalMatch ? postalMatch[1] : '';
    const address = rawAddress.replace(/\d{3}-\d{4}\s*/, '').trim();

    // 2. Member Relations (MR) Tab
    const mrTab = $('[data-tab="mr"]');
    const mrBusiness: KeyValuePair[] = [];
    const mrFamily: KeyValuePair[] = [];
    const mrOthers: KeyValuePair[] = [];

    mrTab.find('h4').each((_, h4) => {
      const heading = $(h4).text().trim();
      const nextTable = $(h4).nextAll('table').first();
      const pairs = parseTable(nextTable);

      if (heading.includes('ビジネス')) {
        mrBusiness.push(...pairs);
      } else if (heading.includes('家族')) {
        mrFamily.push(...pairs);
      } else if (heading.includes('その他')) {
        mrOthers.push(...pairs);
      }
    });

    // 3. GAINS Tab
    const gainsTab = $('[data-tab="gains"]');
    const gainsPairs = parseTable(gainsTab.find('table').first());
    const gainsMap = pairsToMap(gainsPairs);

    const rawSkills = gainsMap['Skill（スキル）'] || '';
    const skillTags = rawSkills
      ? rawSkills
          .split(/[、,・\n]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : [];

    // 4. One to One Tab
    const oneToOneTab = $('[data-tab="one_to_one"]');
    const oneToOne: OneToOneItem[] = [];

    oneToOneTab.find('table tr').each((_, tr) => {
      const cells = $(tr).find('td');
      if (cells.length >= 2) {
        const fullQ = $(cells[0]).text().trim();
        const a = getCleanText($, cells[1]);
        const numMatch = fullQ.match(/^([０-９\d]+)[．\.]/);
        const number = numMatch ? numMatch[1] : '';
        const question = fullQ.replace(/^[０-９\d]+[．\.]\s*/, '').trim() || fullQ;
        oneToOne.push({ number, question, answer: a });
      }
    });

    // 5. Contact Circle Tab
    const contactTab = $('[data-tab="contact"]');
    let top3 = '';
    const contactList: ContactCircleItem[] = [];

    contactTab.find('h4').each((_, h4) => {
      const heading = $(h4).text().trim();
      const tbl = $(h4).nextAll('table').first();

      if (heading.includes('Top3') || heading.includes('トップ３')) {
        const pairs = parseTable(tbl);
        if (pairs.length > 0) {
          top3 = pairs[0].value;
        }
      } else if (heading.includes('コンタクトサークル')) {
        tbl.find('tr').each((_, tr) => {
          const indexText = $(tr).find('.contact-circle-index').text().trim();
          const name = $(tr).find('td:not(.contact-circle-index)').text().trim();
          if (indexText || name) {
            contactList.push({
              index: parseInt(indexText, 10) || contactList.length + 1,
              name,
            });
          }
        });
      }
    });

    // 6. Customer List Tab
    const customerTab = $('[data-tab="customer_list"]');
    const recentCustomers: ContactCircleItem[] = [];
    const aboutCustomers: KeyValuePair[] = [];
    const aboutReferrals: KeyValuePair[] = [];

    customerTab.find('h4').each((_, h4) => {
      const heading = $(h4).text().trim();
      const tbl = $(h4).nextAll('table').first();

      if (heading.includes('直近１０件の顧客')) {
        tbl.find('tr').each((_, tr) => {
          const indexText = $(tr).find('.contact-circle-index').text().trim();
          const name = $(tr).find('td:not(.contact-circle-index)').text().trim();
          if (name) {
            recentCustomers.push({
              index: parseInt(indexText, 10) || recentCustomers.length + 1,
              name,
            });
          }
        });
      } else if (heading.includes('顧客について')) {
        aboutCustomers.push(...parseTable(tbl));
      } else if (heading.includes('リファーラルについて')) {
        aboutReferrals.push(...parseTable(tbl));
      }
    });

    // Profile extracted name
    let profileName = memberMap['名前'] || '';
    if (!profileName) {
      const titleMatch = rawTitle.match(/[\(（](.+?)[\)）]/);
      profileName = titleMatch ? titleMatch[1] : rawTitle.replace('Myプロフィール', '').trim();
    }

    const parsedProfile: ParsedProfile = {
      id: id || '',
      sourceUrl: targetUrl,
      fetchedAt: new Date().toISOString(),
      pageTitle: rawTitle,
      photoUrl,
      meishiOmoteUrl,
      meishiUraUrl,
      memberInfo: {
        name: profileName,
        furigana: memberMap['ふりがな'] || '',
        romaji: memberMap['ローマ字'] || '',
        category: memberMap['カテゴリー'] || '',
        categoryEn: memberMap['カテゴリー（英語表記）'] || '',
        role: memberMap['BNIの役職'] || '',
        joinedDate: memberMap['入会日（宣誓式の日）'] || '',
      },
      businessInfo: {
        company: businessMap['会社名'] || '',
        title: businessMap['肩書・部署'] || '',
        phone: businessMap['電話番号'] || '',
        postalCode,
        address: address || rawAddress,
        email: businessMap['メールアドレス'] || '',
        website,
        facebook,
        otherLinks,
      },
      mr: {
        business: mrBusiness,
        family: mrFamily,
        others: mrOthers,
      },
      gains: {
        goal: gainsMap['Goal（目標）'] || '',
        accomplishments: gainsMap['Accomplishments（実績）'] || '',
        interests: gainsMap['Interests（興味）'] || '',
        networks: gainsMap['Networks（人脈）'] || '',
        skills: rawSkills,
        skillTags,
      },
      oneToOne,
      contactCircle: {
        top3,
        list: contactList,
      },
      customerList: {
        recentCustomers,
        aboutCustomers,
        aboutReferrals,
      },
    };

    return res.json(parsedProfile);
  } catch (error: any) {
    console.error('Error parsing profile:', error);
    return res.status(500).json({
      error: 'プロフィールの解析中にエラーが発生しました: ' + (error?.message || error),
    });
  }
});

// GET /api/proxy-image - proxies images securely with caching headers
app.get('/api/proxy-image', async (req: Request, res: Response) => {
  const imageUrl = req.query.url as string;
  if (!imageUrl) {
    return res.status(400).send('Image URL required');
  }

  try {
    const upstreamRes = await fetch(imageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        Referer: 'https://ne101.ncas.jp/',
      },
    });

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).send('Failed to fetch image');
    }

    const contentType = upstreamRes.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const buffer = await upstreamRes.arrayBuffer();
    return res.send(Buffer.from(buffer));
  } catch (err: any) {
    return res.status(500).send('Proxy error: ' + err.message);
  }
});

// GET /api/vcard - generates standard .vcf contact card for instant smartphone saving
app.get('/api/vcard', (req: Request, res: Response) => {
  const name = (req.query.name as string) || '';
  const furigana = (req.query.furigana as string) || '';
  const company = (req.query.company as string) || '';
  const title = (req.query.title as string) || '';
  const phone = (req.query.phone as string) || '';
  const email = (req.query.email as string) || '';
  const url = (req.query.url as string) || '';
  const address = (req.query.address as string) || '';

  const vcardLines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N;CHARSET=UTF-8:${name};;;;`,
    `FN;CHARSET=UTF-8:${name}`,
  ];

  if (furigana) {
    vcardLines.push(`X-PHONETIC-FIRST-NAME;CHARSET=UTF-8:${furigana}`);
  }
  if (company) {
    vcardLines.push(`ORG;CHARSET=UTF-8:${company}`);
  }
  if (title) {
    vcardLines.push(`TITLE;CHARSET=UTF-8:${title}`);
  }
  if (phone) {
    vcardLines.push(`TEL;TYPE=CELL,VOICE:${phone}`);
  }
  if (email) {
    vcardLines.push(`EMAIL;TYPE=INTERNET,PREF:${email}`);
  }
  if (url) {
    vcardLines.push(`URL:${url}`);
  }
  if (address) {
    vcardLines.push(`ADR;TYPE=WORK;CHARSET=UTF-8:;;${address};;;;`);
  }
  vcardLines.push('END:VCARD');

  const vcardContent = vcardLines.join('\r\n');
  const filename = encodeURIComponent(name ? `${name}.vcf` : 'contact.vcf');

  res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.send(vcardContent);
});

// Start Vite in dev mode or serve static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 BNI Mobile Profile Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
