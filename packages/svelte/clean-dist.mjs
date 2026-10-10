import { readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'

const dist = new URL('./dist/', import.meta.url)

for (const file of readdirSync(dist)) {
  if (file.includes('.test.')) {
    rmSync(new URL(file, dist))
  }
}

const index = new URL('index.js', dist)
const source = readFileSync(index, 'utf8')
writeFileSync(index, source.replace(/^\/\* eslint-disable[\s\S]*?\*\/\r?\n/, ''))

const declaration = new URL('index.d.ts', dist)
const declarationSource = readFileSync(declaration, 'utf8')
writeFileSync(declaration, declarationSource.replaceAll("./StickyAside.svelte'", "./StickyAside.svelte.d.ts'"))
