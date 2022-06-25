const util = require('util')
const fs = require("fs")
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const md = require('markdown-it')({
    html: true,        // Enable HTML tags in source
    xhtmlOut: false,        // Use '/' to close single tags (<br />).
    // This is only for full CommonMark compatibility.
    breaks: false,        // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-',  // CSS language prefix for fenced blocks. Can be
    // useful for external highlighters.
    linkify: false,        // Autoconvert URL-like text to links
    // Enable some language-neutral replacement + quotes beautification
    typographer: false,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: '“”‘’',
})


async function main() {
    let templateWeek = await readFile("input/template/kk-post.html", "utf8")
    let templateBlogs = await readFile("input/template/blogs.html", "utf8")

    // Krabi Koktejl posts
    let posts = [
        { file: 'kk-000', title: 'Krabí koktejl #0', desc: 'Čísluju od nuly i kdybych si měl oči vyplakat!', template: templateWeek, skipRender: false },
    ]

    // Render posts
    posts.forEach(async post => {
        if (!post.skipRender) {
            await render(post.file, post.title, post.desc, post.template)
        } else {
            console.log(`Skipped rendering post: '${post.title}`)
        }
    })

    // Render posts list
    let blogsHtml = replace(templateBlogs, 'Krabí koktejl', 'blogs', 'Všechno možný ze života a tak vůbec', toLinksList(posts.reverse()))
    await writeFile(`../../src/blog/all.html`, blogsHtml)
}

async function render(name, title, perex, template) {
    console.log(`Rendering post with name: '${name}`)
    let cvContent = await readFile(`input/posts/${name}.md`, 'utf8')
    var htmlContent = md.render(cvContent)

    let html = replace(template, title, name, perex, htmlContent)

    await writeFile(`../../src/blog/${name}.html`, html)
}

function replace(template, title, name, perex, htmlContent) {
    return template.replace(/{title}/g, title)
        .replace(/{name}/g, name)
        .replace(/{perex}/g, perex)
        .replace(/{htmlContent}/g, htmlContent)
}

function toLinksList(posts) {
    let postsHtml = ''
    posts.forEach(post => postsHtml += `
    <div>
    <h2>${post.title}</h2>
    <p>
        ${post.desc}        
    </p>
    <p>
    <a href='/blog/${post.file}'>Chcete vědět víc?</a>
    </p>
    </div>
    `)
    postsHtml += ''
    return postsHtml
}

main()