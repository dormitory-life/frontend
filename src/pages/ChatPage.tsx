import { useEffect, useMemo, useRef, useState } from "react"
import type { FormEvent } from "react"
import { useParams } from "react-router-dom"
import api from "../api/api"
import type { ChatMessage } from "../types/types"
import { getApiErrorText } from "../utils/http"

import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material"

export default function ChatPage() {
  const { id } = useParams()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [errorText, setErrorText] = useState("")

  const bottomRef = useRef<HTMLDivElement | null>(null)
  const currentUserId = localStorage.getItem("userId")

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0
      return aTime - bTime
    })
  }, [messages])

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    })
  }

  const loadMessages = async (targetPage: number, silent = false) => {
    if (!id) return

    if (!silent) {
      setLoading(true)
    }

    try {
      const currentRes = await api.get(
        `/core/dormitories/${id}/chat?page=${targetPage}`
      )
      const currentMessages: ChatMessage[] = currentRes.data.messages ?? []
      setMessages(currentMessages)

      const nextRes = await api.get(
        `/core/dormitories/${id}/chat?page=${targetPage + 1}`
      )
      const nextMessages: ChatMessage[] = nextRes.data.messages ?? []
      setHasNextPage(nextMessages.length > 0)
    } catch (error) {
      setErrorText(getApiErrorText(error))
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (!id) return
    loadMessages(page)
  }, [id, page])

  useEffect(() => {
    scrollToBottom()
  }, [sortedMessages])

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadMessages(page, true)
      }
    }, 4000)

    return () => {
      window.clearInterval(interval)
    }
  }, [id, page])

  const sendMessage = async () => {
    if (!id || !text.trim() || sending) return

    setSending(true)

    try {
      await api.post(`/core/dormitories/${id}/chat`, {
        dormitory_id: id,
        text: text.trim(),
      })

      setText("")
      await loadMessages(1, true)
      setPage(1)
    } catch (error) {
      setErrorText(getApiErrorText(error))
    } finally {
      setSending(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await sendMessage()
  }

  return (
    <Container
      maxWidth={false}
        sx={{
        py: 3,
        px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
      }}
    >
      <Card
        sx={{
          width: "100%",
          height: "calc(100vh - 100px)",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#fafafa",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Box>
              <Typography variant="h5">Чат</Typography>
              <Typography variant="body2" color="text.secondary">
                Общежитие #{id}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                disabled={page <= 1 || loading}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Назад
              </Button>
              <Button
                variant="outlined"
                disabled={!hasNextPage || loading}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Вперёд
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 2,
            py: 2,
            backgroundColor: "#f7f8fa",
          }}
        >
          {loading ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : sortedMessages.length === 0 ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="text.secondary">
                Сообщений пока нет.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {sortedMessages.map((message) => {
                const isMine = message.user_id === currentUserId

                return (
                  <Box
                    key={message.id}
                    sx={{
                      display: "flex",
                      justifyContent: isMine ? "flex-end" : "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: { xs: "85%", sm: "70%" },
                        px: 2,
                        py: 1.5,
                        borderRadius: 3,
                        backgroundColor: isMine ? "#1976d2" : "#ffffff",
                        color: isMine ? "#ffffff" : "#111111",
                        boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
                        border: isMine ? "none" : "1px solid #e5e7eb",
                      }}
                    >
                      {!isMine && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            mb: 0.5,
                            color: "text.secondary",
                          }}
                        >
                          {message.email}
                        </Typography>
                      )}

                      <Typography
                        variant="body1"
                        sx={{
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {message.text}
                      </Typography>

                      {message.created_at && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            mt: 0.75,
                            opacity: 0.8,
                            textAlign: "right",
                            color: isMine
                              ? "rgba(255,255,255,0.85)"
                              : "text.secondary",
                          }}
                        >
                          {new Date(message.created_at).toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )
              })}

              <div ref={bottomRef} />
            </Stack>
          )}
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            borderTop: "1px solid #e0e0e0",
            p: 2,
            backgroundColor: "#ffffff",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="flex-end">
            <TextField
              fullWidth
              multiline
              minRows={1}
              maxRows={4}
              placeholder="Введите сообщение..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!text.trim() || sending}
              sx={{ height: 56, px: 3, whiteSpace: "nowrap" }}
            >
              {sending ? "..." : "Отправить"}
            </Button>
          </Stack>
        </Box>
      </Card>

      <Snackbar
        open={Boolean(errorText)}
        autoHideDuration={3000}
        onClose={() => setErrorText("")}
      >
        <Alert severity="error" onClose={() => setErrorText("")}>
          {errorText}
        </Alert>
      </Snackbar>
    </Container>
  )
}