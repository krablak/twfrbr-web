const gen = (() => {

    function lft(color, x, y, size) {
        const yRatio = 3
        const x0 = x * size + size + (y % 2 == 0 ? size / 2 : 0)
        const y0 = y * size + size
        return poly(
            color,
            // 0
            x0, y0,
            // 1
            x0, y0 + size / yRatio * 2,
            // 2
            x0 - size / 2, y0 + size / yRatio,
            // 3
            x0 - size / 2, y0 - size / yRatio,
        )
    }

    function rgh(color, x, y, size) {
        const yRatio = 3
        const x0 = x * size + size + (y % 2 == 0 ? size / 2 : 0)
        const y0 = y * size + size
        return poly(
            color,
            // 0
            x0, y0,
            // 1
            x0, y0 + size / yRatio * 2,
            // 2
            x0 + size / 2, y0 + size / yRatio,
            // 3
            x0 + size / 2, y0 - size / yRatio,
        )
    }

    function top(color, x, y, size) {
        const yRatio = 3
        const x0 = x * size + size + (y % 2 == 0 ? size / 2 : 0)
        const y0 = y * size + size
        return poly(
            color,
            // 0
            x0, y0,
            // 1
            x0 + size / 2, y0 - size / yRatio,
            // 2
            x0, y0 - size / yRatio * 2,
            // 3
            x0 - size / 2, y0 - size / yRatio,
        )
    }

    function poly(color, x0, y0, x1, y1, x2, y2, x3, y3) {
        const polyElem = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
        polyElem.setAttribute("fill", color)
        polyElem.setAttribute("stroke", "none")
        polyElem.setAttribute("points", `${x0},${y0} ${x1},${y1} ${x2},${y2} ${x3},${y3}`)
        return polyElem
    }

    function toChunks(array, chunkSize) {
        const result = []
        for (let i = 0; i < array.length; i += chunkSize) {
            const chunk = array.slice(i, i + chunkSize)
            result.push(chunk)
        }
        return result
    }

    return {
        generate: function (text, colorMap, svgElemId) {
            const svg = document.getElementById(svgElemId)

            svg.innerHTML = ''

            const size = 100
            const boxes = toChunks(text, 3)
            const colsCount = Math.round(Math.sqrt(boxes.length))

            const imgSize = colsCount * size + 2 * size
            svg.setAttribute('viewBox', `0 0 ${imgSize} ${imgSize}`)
            svg.setAttribute('width', `${imgSize}px`)
            svg.setAttribute('height', `${imgSize}px`)

            let curRow = 0;
            let curCol = 0;

            for (let boxNum = 0; boxNum < boxes.length; boxNum++) {
                const rowItem = boxes[boxNum]
                const isOdd = (curRow + 1) % 2 == 0
                const curColsCount = isOdd ? colsCount + 1 : colsCount

                const colorTop = colorMap[rowItem[0]] ?? '#FFFFFF'
                const colorLft = colorMap[rowItem[1]] ?? '#FFFFFF'
                const colorRgh = colorMap[rowItem[2]] ?? '#FFFFFF'

                svg.appendChild(top(colorTop, curCol, curRow, size))
                svg.appendChild(lft(colorLft, curCol, curRow, size))
                svg.appendChild(rgh(colorRgh, curCol, curRow, size))

                if (curCol + 1 == curColsCount) {
                    curRow++
                    curCol = 0
                } else {
                    curCol++
                }
            }
        }
    }
})()


