import { Box, TextField, Button } from '@skynexui/components'
import React from 'react'
import appConfig from '../config.json'
import MessageList from '../src/components/messageList'
import Header from '../src/components/Header'

export default function ChatPage() {
  const [message, setMessage] = React.useState('')
  const [messagesList, setMessagesList] = React.useState([])

  function handleChange(event) {
    setMessage(event.target.value)
  }

  function handleKeyPress(event, message) {
    if (event.key === 'Enter') {
      event.preventDefault()
      sendMessage(message)
    }
  }

  function sendMessage(newMenssage) {
    const message = {
      id: messagesList.length + 1,
      from: 'WendresLucas',
      texto: newMenssage
    }

    setMessagesList([message, ...messagesList])
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
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
