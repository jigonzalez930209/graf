
import * as React from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
import remarkToc from 'remark-toc'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import './style-md.css'

const MdText = ({ style, mdPath }) => {
  const [text, setText] = React.useState<string>('');
  const [isDark, setIsDark] = React.useState(true)

  React.useEffect(() => {
    fetch(mdPath)
      .then((res) => res.text())
      .then((text) => setText(text));
  }, [mdPath]);


  return (
    <ReactMarkdown
      className="markdown-body"
      remarkPlugins={[remarkGfm, remarkSlug, remarkToc]}
      rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
      components={{}}
    // rehypePlugins={[rehypeKatex]}
    >
      {text}
    </ReactMarkdown>
  );
};

export default MdText;