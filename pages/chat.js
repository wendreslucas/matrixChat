import { Box, TextField, Button } from '@skynexui/components'
import React from 'react'
import appConfig from '../config.json'
import MessageList from '../src/components/messageList'
import Header from '../src/components/Header'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import { ButtonSendSticker } from '../src/components/ButtonSendSticker.js'

const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI4MzQyOSwiZXhwIjoxOTU4ODU5NDI5fQ.Q4AT5E1vMcs-w01gZ0jmA2m4iBUj3xNwwLzw_a9PdMc'
const SUPABASE_URL = 'https://fcqmeylygdbsghoeqdbm.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function escutaMensagensEmTempoReal(adicionaMensagem) {
  return supabaseClient
    .from('mensagens')
    .on('INSERT', respostaAutomatica => {
      adicionaMensagem(respostaAutomatica.new)
    })
    .subscribe()
}

export default function ChatPage() {
  const roteamento = useRouter()
  const usuarioLogado = roteamento.query.username
  const [message, setMessage] = React.useState('')
  const [messagesList, setMessagesList] = React.useState([])

  React.useEffect(() => {
    supabaseClient
      .from('mensagens')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        setMessagesList(data)
      })
    escutaMensagensEmTempoReal(newMessage => {
      console.log('Nova mensagem', newMessage)
      console.log('Lista', messagesList)

      setMessagesList(valorAtualDaLista => {
        return [newMessage, ...valorAtualDaLista]
      })
    })
  }, [])

  function handleChange(event) {
    setMessage(event.target.value)
  }

  function handleKeyPress(event, message) {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (!message) {
        alert('Usuário Inválido')
        return
      }
      sendMessage(message)
    }
  }

  function sendMessage(newMessage) {
    const message = {
      //id: messagesList.length + 1,
      de: usuarioLogado,
      texto: newMessage
    }

    supabaseClient
      .from('mensagens')
      .insert([message])
      .then(({ data }) => {
        console.log('Criando mensagem', data)
      })

    setMessage('')
  }

  return (
    <Box
      styleSheet={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://images.unsplash.com/photo-1589519160732-57fc498494f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px'
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px'
          }}
        >
          <MessageList
            messages={messagesList}
            setMessagesList={setMessagesList}
          />

          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <TextField
              value={message}
              onChange={handleChange}
              onKeyPress={event => handleKeyPress(event, message)}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200]
              }}
            />
            <Button
              type="button"
              label="Enviar"
              styleSheet={{
                height: '100%',
                background: '#001214',
                hover: {
                  backgroundColor: appConfig.theme.colors.neutrals['700']
                }
              }}
              onClick={() => sendMessage(message)}
            />
            <ButtonSendSticker
              onStickerClick={sticker => {
                console.log(
                  '[USANDO COMPONENTE] Salva sticker no banco',
                  sticker
                )
                sendMessage(':sticker:' + sticker)
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
