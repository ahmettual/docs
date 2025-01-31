import { expect } from '@jest/globals'

import { TRANSLATIONS_FIXTURE_ROOT } from '../../lib/constants.js'
import { getDOM } from '../helpers/e2etest.js'

if (!TRANSLATIONS_FIXTURE_ROOT) {
  let msg = 'You have to set TRANSLATIONS_FIXTURE_ROOT to run this test.'
  msg += ' Add TRANSLATIONS_FIXTURE_ROOT=tests/fixtures/translations'
  throw new Error(msg)
}

describe('translations', () => {
  test('home page', async () => {
    const $ = await getDOM('/ja')
    const h1 = $('h1').text()
    // You gotta know your tests/fixtures/translations/ja-jp/data/ui.yml
    expect(h1).toBe('日本 GitHub Docs')

    // The header banner mentions something about
    // "For the most up-to-date content, see the English version."
    const notification = $('[data-testid="header-notification"]')
    expect(notification.length).toBe(1)
    const toEnglishDoc = notification.find('a#to-english-doc')
    expect(toEnglishDoc.text()).toBe('English documentation')
  })

  test('hello world', async () => {
    const $ = await getDOM('/ja/get-started/quickstart/hello-world')
    const h1 = $('h1').text()
    expect(h1).toBe('こんにちは World')
  })

  test('internal links get prefixed with /ja', async () => {
    const $ = await getDOM('/ja/get-started/quickstart/link-rewriting')
    const links = $('#article-contents a[href]')
    const jaLinks = links.filter((i, element) => $(element).attr('href').startsWith('/ja'))
    const enLinks = links.filter((i, element) => $(element).attr('href').startsWith('/en'))
    expect(jaLinks.length).toBe(2)
    expect(enLinks.length).toBe(0)
  })

  test('internal links with AUTOTITLE resolves', async () => {
    const $ = await getDOM('/ja/get-started/foo/autotitling')
    const links = $('#article-contents a[href]')
    links.each((i, element) => {
      if ($(element).attr('href').includes('/ja/get-started/quickstart/hello-world')) {
        expect($(element).text()).toBe('こんにちは World')
      }
    })
    // There are 4 links on the `autotitling.md` content.
    expect.assertions(4)
  })
})
