const form = (() => {

    const colorInputs = [
        document.getElementById('color-0'),
        document.getElementById('color-1'),
        document.getElementById('color-2'),
        document.getElementById('color-3')
    ]

    init = () => {
        const textInp = document.getElementById("text")
        textInp.value = 'Tak tohle je snad opravdu dobr'

        const generate = () => {
            const colorValues = colorInputs.map(el => el.value)
            const text = normText(textInp.value)
            const clrMap = colors.createColorMap(colors.colorsByRangeAndText(colorValues, text), text)
            gen.generate(text, clrMap, "image")

            updateDownload()
        }

        textInp.addEventListener('input', generate)
        colorInputs.forEach(el => el.addEventListener('input', generate))


        generate()
    }

    updateDownload = () => {
        document.getElementById('download-link').setAttribute('href', toSVGData('image'))
    }

    toSVGData = (id) => {
        const svg = document.getElementById(id)
        const serializer = new XMLSerializer()
        let source = serializer.serializeToString(svg)

        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"')
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"')
        }
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source
        const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source)
        return url
    }

    normText = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()

    onReady = (fn) => {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    return {
        init: init,
        onReady: onReady
    }
})()

form.onReady(form.init)