#!/usr/bin/env node

/**
 * TypeScript Compiler API の getSuggestionDiagnostics() で
 * 非推奨API (TS6385/TS6387) 等の suggestion diagnostics を検出する
 *
 * 使用方法: node scripts/extract-suggestion-diagnostics.js
 */

const ts = require('typescript')
const path = require('path')
const fs = require('fs')

function loadTsConfig(configPath) {
  const configFile = ts.readConfigFile(configPath, (filePath) =>
    fs.readFileSync(filePath, 'utf8')
  )
  if (configFile.error) {
    console.error(`tsconfig.json の読み込みエラー: ${configFile.error.messageText}`)
    process.exit(1)
  }

  const result = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath)
  )
  if (result.errors.length > 0) {
    result.errors.forEach((err) => console.error(err.messageText))
    process.exit(1)
  }

  return result
}

function isExcludedFile(filePath) {
  return (
    filePath.includes('/node_modules/') ||
    filePath.includes('/.next/')
  )
}

function extractSuggestionDiagnostics(tsConfigPath) {
  const config = loadTsConfig(tsConfigPath)
  const sourceFiles = config.fileNames.filter((file) => !isExcludedFile(file))

  const program = ts.createProgram(sourceFiles, config.options)
  const suggestions = []

  for (const filePath of sourceFiles) {
    const sourceFile = program.getSourceFile(filePath)
    if (!sourceFile) continue

    for (const diagnostic of program.getSuggestionDiagnostics(sourceFile)) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(
        diagnostic.start ?? 0
      )
      const message =
        typeof diagnostic.messageText === 'string'
          ? diagnostic.messageText
          : diagnostic.messageText?.messageText ?? ''

      suggestions.push({
        filePath,
        line: line + 1,
        column: character + 1,
        message,
        code: diagnostic.code ?? 0,
      })
    }
  }

  return suggestions
}

function formatOutput(suggestions) {
  if (suggestions.length === 0) {
    console.log('\nSuggestion diagnostics は見つかりませんでした。')
    return
  }

  console.log(`\n検出: ${suggestions.length}件\n`)

  const grouped = Object.groupBy(suggestions, (s) => s.filePath)

  for (const [filePath, items] of Object.entries(grouped)) {
    console.log(filePath)
    for (const s of items) {
      console.log(`  ${s.line}:${s.column} [TS${s.code}] ${s.message}`)
    }
    console.log('')
  }
}

const projectRoot = path.resolve(__dirname, '..')
const tsConfigPath = path.join(projectRoot, 'tsconfig.json')

if (!fs.existsSync(tsConfigPath)) {
  console.error(`tsconfig.json が見つかりません: ${tsConfigPath}`)
  process.exit(1)
}

const suggestions = extractSuggestionDiagnostics(tsConfigPath)
formatOutput(suggestions)
