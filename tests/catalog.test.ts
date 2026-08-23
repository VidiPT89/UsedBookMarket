import assert from 'node:assert/strict'
import { test } from 'node:test'
import { matchesQuery } from '../src/lib/catalog'

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
