import { createRichTextHtmlResolver } from '@kontent-ai/delivery-sdk';
import { nodeParser } from '@kontent-ai/delivery-node-parser';

export const resolveRichText = (element) => createRichTextHtmlResolver(nodeParser).resolveRichText({
    element,
    linkedItems: element.linkedItems,
    urlResolver: (linkId, _linkText, link) => {
        switch (link.type) {
            case "article":
                return {
                    linkUrl: `/articles/${linkId}`
                }
            case "coffee":
                return {
                    linkUrl: `/coffee/${link.codename}`
                }
            case "brewer":
                return {
                    linkUrl: `/brewer/${link.codename}`
                }
            default:
                return { linkUrl: ""}
        }
    },
    contentItemResolver: (_itemId, contentItem) => {
        if (contentItem && contentItem.system.type === 'hosted_video') {
            if (contentItem.elements.videoHost.value[0].codename === "vimeo") {
                return {
                    contentItemHtml: `<iframe class="hosted-video__wrapper"
                    src="https://player.vimeo.com/video/${contentItem.elements.videoId.value}?title =0&byline =0&portrait =0"
                    width="640"
                    height="360"
                    frameborder="0"
                    webkitallowfullscreen
                    mozallowfullscreen
                    allowfullscreen
                    >
                    </iframe>`
                };
            } else if (contentItem.elements.videoHost.value[0].codename === "youtube") {
                return {
                    contentItemHtml: `<iframe class="hosted-video__wrapper"
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/${contentItem.elements.videoId.value}"
                    frameborder="0"
                    allowfullscreen
                    >
                    </iframe>`
                }
            }
            return {
                contentItemHtml: ''
            };
        } else if ((contentItem && contentItem.system.type === 'tweet')) {
            return {
                contentItemHtml: `<div>
                <blockquote class="twitter-tweet" data-theme="${contentItem.elements.theme.value[0].codename}" ${contentItem.elements.displayOptions.value.some(e => e.codename === "hide_thread") ? "data-conversation=hidden" : ''} ${contentItem.elements.displayOptions.value.some(e => e.codename === "hide_media") ? "data-conversation=none" : ''}>
                <a href="${contentItem.elements.tweetLink.value}"></a>
                </blockquote> 
                <script async src="https://platform.twitter.com/widgets.js" charset="utf-8">
                </script>
                </div>`
            }
        }

        return {
            contentItemHtml: ''
        };
    }
});

export const resolveRichTextItem = (item, resolvedCodenames) => {
    for (const codename in item.elements) {
        if (item.elements[codename].type === 'rich_text') {
            item.elements[codename].value = resolveRichText(item.elements[codename]).html;
        } else if (item.elements[codename].type === 'modular_content' && !resolvedCodenames.includes(item.system.codename)) {
                resolvedCodenames.push(item.system.codename);
                item.elements[codename].linkedItems.forEach(item => resolveRichTextItem(item, resolvedCodenames));
        }
    }
}

