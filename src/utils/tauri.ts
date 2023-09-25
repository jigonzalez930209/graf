import _ from 'lodash'
import { read, utils, write } from 'xlsx'
import { Store } from 'tauri-plugin-store-api'
import { readBinaryFile } from '@tauri-apps/api/fs'
import { open, save } from '@tauri-apps/api/dialog'

import { ProcessFile, IGraftState } from '../interfaces/interfaces'

import { extractSerialPoint, fileType } from './common'
import { COLORS } from './utils'
const Utf8ArrayToStr = (array: number[]): string => {
  let out, i, len, c
  let char2, char3

  out = ''
  len = array.length
  i = 0
  while (i < len) {
    c = array[i++]
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c)
        break
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++]
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f))
        break
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++]
        char3 = array[i++]
        out += String.fromCharCode(((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0))
        break
    }
  }

  return out
}

const readFileContents = async file => {
  return new Promise((resolve, reject) => {
    try {
      resolve(readBinaryFile(file))
    } catch (error) {
      reject(error)
    }
  })
}

const readAllTauriProcess = async AllFiles => {
  let notSupported: string[] = []
  const results = await Promise.all(
    AllFiles.filter(file => {
      const name = _.last(file.split(/\\/g)) as string
      if (!['csv', 'teq4', 'teq4z'].includes(fileType(name))) {
        console.log(`File type not supported '${name}'`)
        notSupported.push(name)
        return false
      }
      return true
    }).map(async file => {
      const fileContents = await readFileContents(file)
      const name = _.last(file.split(/\\/g)) as string

      if (fileType(name) === 'csv') {
        const contentXLSX = read(fileContents as number[], { type: 'array' })
        const content = Object.values(utils.sheet_to_json(contentXLSX.Sheets[contentXLSX.SheetNames[0]])).map(
          i => Object.values(i)
        )

        const columns = Object.keys(utils.sheet_to_json(contentXLSX.Sheets[contentXLSX.SheetNames[0]])[0])
        const invariableContent = [columns, ...content]

        const selectedInvariableContentIndex = invariableContent.reduce(
          (acc, curr, index) => (curr.length > acc.value ? { value: curr.length, index: index } : acc),
          { index: 0, value: content[0].length }
        ).index

        return {
          content,
          name,
          invariableContent,
          selectedInvariableContentIndex,
          columns: invariableContent[selectedInvariableContentIndex],
        }
      }
      return { content: await Utf8ArrayToStr(fileContents as number[]), name }
    })
  )

  return { results, notSupported }
}

const readAllFiles = async selected => {
  const readAllFiles = await readAllTauriProcess(selected)
  const contents = await extractSerialPoint(await readAllFiles.results)
  return {
    contents: contents as ProcessFile[],
    notSupported: readAllFiles.notSupported,
  }
}

const readFilesUsingTauriProcess = async () => {
  const selected = await open({
    multiple: true,
    filters: [
      {
        name: '[*.teq4Z] [*.teq4] [*.csv]',
        extensions: ['teq4Z', 'teq4', 'csv'],
      },
    ],
  })
  if (Array.isArray(selected)) {
    const readAll = await readAllFiles(selected)
    return await readAll.contents.map((f, i) => ({ ...f, color: COLORS[i] }))
  } else if (selected === null) {
    console.log('user cancelled the selection')
  } else {
    console.log('user selected a single file')
  }
}

const initStorage = async () => {
  const store = new Store('.settings.dat')

  if ((await store.values()).length > 0 && !_.isEmpty(await store.get('files'))) {
    return await store.get('files').then(f => f as ProcessFile[])
  }
  return [] as ProcessFile[]
}

const saveStorage = async (files: ProcessFile[], path: string) => {
  const store = new Store(path ? path : 'current.graft')
  await store.set('files', files)
}

const openProject = async () => {
  let notification: { message: string; variant: 'success' | 'error' }
  let data: IGraftState
  try {
    const p = await open({
      title: 'Open Project',
      multiple: false,
      directory: false,
      filters: [{ name: 'Graft Project', extensions: ['graft'] }],
    })

    const store = new Store(p.toString())
    data = await store
      .get('graft')
      .then(d => d as IGraftState)
      .catch(err => err)
    notification = {
      message: 'Project opened successfully',
      variant: 'success',
    }
  } catch (err) {
    console.log(err)
    notification = {
      message: 'Project not saved. Error occurred while saving',
      variant: 'error',
    }
  } finally {
    return { data, notification }
  }
}

const clearStorage = async () => {
  const store = new Store('.settings.dat')
  await store.clear()
}

const saveProject = async (s: IGraftState) => {
  let notification: { message: string; variant: 'success' | 'error' }
  try {
    const p = await save({
      title: 'Save Project',
      filters: [{ name: 'Graft project', extensions: ['graft'] }],
    })

    const store = new Store(p)
    await store.set('graft', s)
    await store.save()
    notification = {
      message: 'Project saved successfully',
      variant: 'success',
    }
  } catch (err) {
    console.log(err)
    notification = {
      message: 'Project not saved. Error occurred while saving',
      variant: 'error',
    }
  } finally {
    return notification
  }
}

export {
  readFilesUsingTauriProcess,
  initStorage,
  saveStorage,
  clearStorage,
  saveProject,
  openProject,
  readAllFiles,
  readFileContents,
  Utf8ArrayToStr,
}
