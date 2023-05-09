
import * as React from 'react'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import remarkToc from 'remark-toc'
import remarkSlug from 'remark-slug'
import rehypeKatex from 'rehype-katex'
import ReactMarkdown from 'react-markdown'
import Backdrop from '@mui/material/Backdrop'
import rehypeHighlight from 'rehype-highlight'

import Loader from '../../Loader/Loader'

import './style-md.css'

const MdText = ({ style, mdPath }) => {
  const [text, setText] = React.useState<string>('')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)
    fetch(mdPath)
      .then(res => {
        return res.text()
      })
      .then(text => setText(text))
      .finally(() => setLoading(false))
  }, [mdPath])

  return (
    <>
      {loading ? (
        <Backdrop
          sx={{ color: '#fff', zIndex: theme => theme.zIndex.modal + 1 }}
          open={loading}
          onClick={() => {}}
        >
          <Loader type='hash' />
        </Backdrop>
      ) : (
        <ReactMarkdown
          className='markdown-body'
          remarkPlugins={[remarkGfm, remarkSlug, remarkToc]}
          rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
          components={{}}
        >
          {text}
        </ReactMarkdown>
      )}
    </>
  )
}

export default MdText