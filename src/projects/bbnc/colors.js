const colors = (() => {
    return {
        createColorMap: (colorVarFn, text) => {
            const map = {}
            for (const curChar of text.split('')) {
                map[curChar] = colorVarFn(curChar)
            }
            return map
        },
        colorsByRangeAndText: (colorsRange, text) => {
            const textChars = [...new Set(text.toUpperCase().split('').sort())]
            const colorsScale = chroma.scale(colorsRange).mode('lch').colors(textChars.length)
            return (char) => {
                return colorsScale[textChars.indexOf(char)]
            }
        }
    }
})()