import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ensureMatchedTags(svgCode: string) {
  // 修复自闭合标签
  const selfClosingTags = ['br', 'hr', 'img', 'input']

  let fixedSvg = svgCode

  // 将所有自闭合标签转换为标准格式
  selfClosingTags.forEach((tag) => {
    const regex = new RegExp(`<${tag}\\s*(?!/)>`, 'g')
    fixedSvg = fixedSvg.replace(regex, `<${tag}/>`)
  })

  return fixedSvg
}
