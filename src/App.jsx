import { CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import Body from './components/Body'
import Footer from './components/Footer'
import Header from './components/Header'
import toMarkdown from './converterFunctions/toMarkdown'


export default function App() {
    const [showMarkdown, setShowMarkdown] = useState(false)
    const [mode, setMode] = useState('light')
    const [title, setTitle] = useState('')
    const [mdText, setMdText] = useState('')
    const [quill, setQuill] = useState(null)

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    })

    const lightTheme = createTheme({
        palette: {
            mode: 'light',
        },
    })

    const selectedTheme = mode === "dark" ? darkTheme : lightTheme

    const onUpload = (e) => {
        const allowedFileTypes = ['txt', 'md']
        const file = e.target.files[0]

        const reader = new FileReader()

        const getFileType = (fileName) => {
            return fileName.split('.').pop().toLowerCase()
        }

        if (!allowedFileTypes.includes(getFileType(file.name))) {
            alert('Invalid file type! (.txt or .md only)')
            return
        }

        reader.readAsText(file)
        reader.onload = () => {
            setMdText(reader.result)
        }
    }

    const getMarkdownText = () => toMarkdown(document.getElementsByClassName('ql-editor')[0])

    useEffect(() => {
        if (!showMarkdown) return
        if (document.getElementsByClassName('ql-editor')[0] === undefined) return

        setMdText(getMarkdownText())
    }, [showMarkdown])

    useEffect(() => {
        if (quill === null) return

        quill.on('text-change', () => {
            setMdText(getMarkdownText())
        })
    }, [quill])


    return (
        <ThemeProvider theme={selectedTheme}>
            <CssBaseline />
            <div id='app'>
                <Header
                    theme={mode}
                    title={title}
                    setTitle={setTitle}
                    toggleTheme={() => setMode(mode === 'light' ? 'dark' : 'light')}
                    onUpload={onUpload}
                />
                <Body showMarkdown={showMarkdown} mdText={mdText} setQuill={setQuill} />
                <div>
                    <Footer onClick={() => setShowMarkdown(!showMarkdown)} showMarkdown={showMarkdown} theme={mode}/>
                </div>
            </div>
        </ThemeProvider>
    )
}