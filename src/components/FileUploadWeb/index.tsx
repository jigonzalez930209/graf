import * as React from 'react'
import { IconButton } from '@mui/material'

type FileUploaderProps = {
  handleFile: (file: FileList) => void
  children: JSX.Element
}

const FileUploader = ({ children, handleFile }: FileUploaderProps) => {
  const hiddenFileInput = React.useRef(null)

  const handleClick = () => {
    hiddenFileInput.current.click()
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileUploaded = event.target.files
    handleFile(fileUploaded)
  }
  return (
    <>
      <IconButton size='small' color='inherit' sx={{ marginRight: 1 }} onClick={handleClick}>
        {children}
      </IconButton>
      <input
        type='file'
        ref={hiddenFileInput}
        onChange={handleChange}
        multiple
        accept='.teq4,.teq4Z,.csv'
        style={{ display: 'none' }}
      />
    </>
  )
}
export default FileUploader
