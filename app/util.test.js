// @flow
/* eslint-env jest */
import { normalizeUrl } from './util'

describe('normalizeUrl', () => {
  it('can normalize urls that are missing protocols', () => {
    expect(normalizeUrl('example.com')).toEqual('http://example.com/')
    expect(normalizeUrl('example.com/foo/bar')).toEqual('http://example.com/foo/bar')
    expect(normalizeUrl('example.com:8080')).toEqual('http://example.com:8080/')
    expect(normalizeUrl('example.com:8080/foo/bar')).toEqual('http://example.com:8080/foo/bar')
    expect(normalizeUrl('about:blank')).toEqual('about:blank')
  })
})
