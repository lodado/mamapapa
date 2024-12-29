import { Node as ProsemirrorNode, NodeSpec, NodeType, Schema } from 'prosemirror-model'
import { Command, EditorState, Plugin, TextSelection, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

import BaseNode from '../BaseNode' // BaseNode가 저장된 파일의 경로를 지정하세요.
import Paragraph from '../Paragraph'
import { exit } from '../utils'
import { sanitizeUrl } from "../../utils";
 

export default class ProseImage extends BaseNode {
  paragraph: Paragraph

  constructor({ paragraph }: { paragraph: Paragraph }) {
    super()
    this.paragraph = paragraph
  }
  get name() {
    return 'image'
  }

  get createSchema(): NodeSpec {
    return {
      attrs: {
        src: {},

        alt: { default: null },
        title: { default: null },
        width: { default: 'auto' },
        ratio: { default: '1/1' },
      },
      group: 'block',
      draggable: true,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs: (dom) => ({
            src: dom.getAttribute('src'),
            alt: dom.getAttribute('alt'),
            title: dom.getAttribute('title'),
            width: dom.style.width || 'auto',
            ratio: dom.style.aspectRatio || '1/1',
          }),
        },
      ],
      toDOM: (node) => [
        'div',
        { style: 'position: relative;', 'data-image-id': `image-${node.attrs.id}` },

        [
          'div',
          { style: 'position: relative; width: max-content; height: max-content;' },
          [
            'img',
            {
              src: sanitizeUrl(node.attrs.src),
              title: node.attrs.title,
              alt: node.attrs.alt,
              style: `width: ${node.attrs.width}; aspect-ratio: ${node.attrs.ratio}; object-fit: cover;`,
            },
          ],
          [
            'div',
            {
              class: 'resize-handle',
              style:
                'width: 10px; height: 10px; background: gray; cursor: se-resize; position: absolute; right: 0px; bottom: 0px; ',
            },
          ],
        ],
      ],
    }
  }

  inputRules() {
    return []
  }

  /** TO-DO throttle 걸기 */
  private handleImageResize(view: EditorView, event: MouseEvent) {
    const handle = event.target as HTMLElement
    const img = handle.previousSibling as HTMLElement
    const startX = event.clientX
    const startY = event.clientY

    const startWidth = parseInt(document.defaultView?.getComputedStyle(img).width || '0', 10)
    const startHeight = parseInt(document.defaultView?.getComputedStyle(img).height || '0', 10)

    const doDrag = (e: MouseEvent) => {
      img.style.width = `${startWidth + e.clientX - startX}px`
      // img.style.height = `${startHeight + e.clientY - startY}px`
    }

    const stopDrag = (e: MouseEvent) => {
      document.documentElement.removeEventListener('mousemove', doDrag, false)
      document.documentElement.removeEventListener('mouseup', stopDrag, false)

      // 이미지 노드 업데이트
      const tr = view.state.tr.setNodeMarkup(view.state.selection.from, null, {
        // @ts-ignore
        ...view.state.selection.node.attrs,
        width: img.style.width,
      })
      view.dispatch(tr)
    }

    document.documentElement.addEventListener('mousemove', doDrag, false)
    document.documentElement.addEventListener('mouseup', stopDrag, false)
  }
  handleInsertImage = (state: EditorState, dispatch?: (tr: Transaction) => void) => {
    const { selection } = state
    const { $from } = selection
    const position = $from.pos

    const node = this.type.create({
      src: 'https://via.placeholder.com/150',
      alt: 'Placeholder Image',
      title: 'Placeholder Image',

      width: '150px',
      ratio: 1 / 1,
    })

    const transaction = state.tr.insert(position, node)

    // 노드의 끝 위치 확인
    const nodeEnd = $from.end()

    if (position === nodeEnd) {
      return exit(this.paragraph.type, transaction, position + 2)(state, dispatch)
    }

    dispatch?.(transaction)
    return true
  }

  keys() {
    return {
      /* TODO
        테스트를 위해 잠시 넣어둔 커맨드로 삭제해야함. 
    
      */
      'Ctrl-Space': this.handleInsertImage,
    }
  }

  plugins() {
    return [
      ...super.plugins(),

      new Plugin({
        props: {
          handleDOMEvents: {
            dblclick: (view, event) => {
              if ((event.target as HTMLElement)?.className === 'resize-handle') {
                this.handleImageResize(view, event)
                return true
              }
              return false
            },
          },

          nodeViews: {
            // image: (node, view, getPos) => {
            //   return new ImageNodeView(node, view, () => getPos() ?? 0)
            // },
          },
        },
      }),
    ]
  }
}
