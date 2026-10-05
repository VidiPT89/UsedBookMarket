import assert from 'node:assert/strict'
import { test } from 'node:test'
import { formatEuro, matchesQuery } from '../src/lib/catalog'

test('empty query matches every book', () => {
  assert.equal(matchesQuery({ title: 'Memorial', author: 'Saramago', category: 'fiction' }, ''), true)
})

test('matches title, author or category', () => {
  const book = { title: 'Memorial do Convento', author: 'José Saramago', category: 'fiction' }
  assert.equal(matchesQuery(book, 'convento'), true)
  assert.equal(matchesQuery(book, 'saramago'), true)
  assert.equal(matchesQuery(book, 'fiction'), true)
  assert.equal(matchesQuery(book, 'asterix'), false)
})

test('search ignores case and surrounding spaces', () => {
  const book = { title: 'Os Lusíadas', author: 'Luís de Camões', category: 'poetry' }
  assert.equal(matchesQuery(book, '  CAMÕES  '), true)
  assert.equal(matchesQuery(book, 'POETRY'), true)
  assert.equal(matchesQuery(book, '   '), true)
})

test('a query must appear as written, not as scattered letters', () => {
  const book = { title: 'Ensaio sobre a Cegueira', author: 'José Saramago', category: 'fiction' }
  assert.equal(matchesQuery(book, 'cegueira'), true)
  assert.equal(matchesQuery(book, 'cgr'), false)
})

test('prices are shown in euros the Portuguese way', () => {
  assert.match(formatEuro(1200), /^12,00\s€$/u)
  assert.match(formatEuro(5), /^0,05\s€$/u)
  assert.match(formatEuro(123456), /^1\s?234,56\s€$/u)
})
