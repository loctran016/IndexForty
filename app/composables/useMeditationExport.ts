import ExcelJS from 'exceljs'
import { MEDITATION_PRACTICES } from '~/data/meditationPractices'

export function useMeditationExport() {
  async function exportToExcel({
    year,
    month,
    monthLabel,
    dayNumbers,
    countForDay,
    ownerName = '',
  }) {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Practice Log')

    const NUM_LEAD_COLS = 3 // #, Practice, Unit
    const totalCols = NUM_LEAD_COLS + dayNumbers.length

    // --- Title row (owner name), yellow fill ---
    sheet.mergeCells(1, 1, 1, totalCols)
    const titleCell = sheet.getCell(1, 1)
    titleCell.value = ownerName
    titleCell.font = { bold: true, size: 13 }
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF4C430' } }

    // --- Năm / Tháng rows ---
    sheet.getCell(2, 1).value = 'Năm'
    sheet.getCell(2, 4).value = year
    sheet.getCell(3, 1).value = 'Tháng'
    sheet.getCell(3, 4).value = month

    // --- "Ngày" header row, blue fill ---
    const headerRowNum = 4
    sheet.getCell(headerRowNum, 1).value = 'Ngày'
    sheet.getCell(headerRowNum, 2).value = ''
    sheet.getCell(headerRowNum, 3).value = ''
    dayNumbers.forEach((day, i) => {
      sheet.getCell(headerRowNum, NUM_LEAD_COLS + 1 + i).value = day
    })
    const headerRow = sheet.getRow(headerRowNum)
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } }
      cell.alignment = { horizontal: 'center' }
    })

    // --- One row per practice ---
    // Grouping is my best guess from your screenshot, not exact —
    // adjust `groupColor` below to match your real categories.
    const groupColor = (index) => {
      if (index < 6) return null // no fill, matches top group in reference
      if (index < 10) return 'FFF3D9E0' // light pink block
      return 'FFDDEEDD' // light green block
    }

    MEDITATION_PRACTICES.forEach((practice, idx) => {
      const rowNum = headerRowNum + 1 + idx
      const row = sheet.getRow(rowNum)

      row.getCell(1).value = idx + 1
      row.getCell(2).value = practice.label
      row.getCell(3).value = practice.unit

      dayNumbers.forEach((day, i) => {
        const value = countForDay(practice.key, day)
        row.getCell(NUM_LEAD_COLS + 1 + i).value = value ?? ''
      })

      const fill = groupColor(idx)
      if (fill) {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } }
        })
      }
    })

    // --- Column widths + frozen panes (matches the pinned-column UI) ---
    sheet.getColumn(1).width = 4
    sheet.getColumn(2).width = 26
    sheet.getColumn(3).width = 8
    for (let i = 0; i < dayNumbers.length; i++) {
      sheet.getColumn(NUM_LEAD_COLS + 1 + i).width = 6
    }

    sheet.views = [{ state: 'frozen', xSplit: NUM_LEAD_COLS, ySplit: headerRowNum }]

    // --- Trigger browser download ---
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${monthLabel}_${year}_practice_log.xlsx`
    link.click()
    URL.revokeObjectURL(url)
  }

  return { exportToExcel }
}
