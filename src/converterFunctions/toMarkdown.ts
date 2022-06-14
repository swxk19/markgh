import TurndownService from 'turndown'
import postProcessMarkdown from './helpers/postProcessMarkdown'
import preProcessHtml from './helpers/preProcessHtml'
import {
    align,
    codeBlocks,
    ignoreTipTapArtifacts,
    resizedImage,
    strikethrough,
    underline,
} from './turndownPlugins'
import noListItemSpacing from './turndownPlugins/noListItemSpacing'

export default (html: HTMLElement) => {
    const htmlCopy = html.cloneNode(true) as HTMLElement
    preProcessHtml(htmlCopy)

    const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
    }).use([
        codeBlocks,
        underline,
        align,
        strikethrough,
        resizedImage,
        ignoreTipTapArtifacts,
        noListItemSpacing,
    ])

    const markdown = turndownService.turndown(htmlCopy)
    return postProcessMarkdown(markdown)
}
