import Markdown from 'markdown-to-jsx';
import * as React from 'react';
import Code from './Code';


const MdText = ({ style, mdPath }) => {
  const [text, setText] = React.useState<string>('');
  const [isDark, setIsDark] = React.useState(true)

  React.useEffect(() => {
    fetch(mdPath)
      .then((res) => res.text())
      .then((text) => setText(text));
  }, [mdPath]);


  return (
    <Markdown
      options={{
        overrides: {
          Code: {
            component: Code,
            props: {
              isDark,
              setIsDark
            }
          }
        }
      }}
    >
      {text}
    </Markdown>
  );
};

export default MdText;