import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/api"
import type { Event } from "../types/types"
import { getApiErrorText } from "../utils/http"
import EventCard from "../components/EventCard"

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material"

const EVENT_FILES_FIELD_NAME = "photos"

export default function FeedPage() {
  const { id } = useParams()

  const [events, setEvents] = useState<Event[]>([])
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)

  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [files, setFiles] = useState<File[]>([])

  const [errorText, setErrorText] = useState("")
  const [successText, setSuccessText] = useState("")

  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [previewImageAlt, setPreviewImageAlt] = useState("")

  const loadEvents = async (targetPage: number) => {
    if (!id) return

    try {
      const currentRes = await api.get(
        `/core/dormitories/${id}/events?page=${targetPage}`
      )
      const currentEvents: Event[] = currentRes.data.events ?? []
      setEvents(currentEvents)

      const nextRes = await api.get(
        `/core/dormitories/${id}/events?page=${targetPage + 1}`
      )
      const nextEvents: Event[] = nextRes.data.events ?? []
      setHasNextPage(nextEvents.length > 0)
    } catch (error) {
      setErrorText(getApiErrorText(error))
    }
  }

  useEffect(() => {
    void loadEvents(page)
  }, [id, page])

  const handleCreateEvent = async () => {
    if (!id) return

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)

      files.forEach((file) => {
        formData.append(EVENT_FILES_FIELD_NAME, file)
      })

      await api.post(`/core/dormitories/${id}/events`, formData)

      setOpenAddDialog(false)
      setTitle("")
      setDescription("")
      setFiles([])
      setSuccessText("событие добавлено")
      await loadEvents(1)
      setPage(1)
    } catch (error) {
      setErrorText(getApiErrorText(error))
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!id) return

    try {
      await api.delete(`/core/dormitories/${id}/events/${eventId}`)
      setSuccessText("событие удалено")
      await loadEvents(page)
    } catch (error) {
      setErrorText(getApiErrorText(error))
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">События</Typography>

        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={() => setOpenAddDialog(true)}>
            Добавить событие
          </Button>
          <Button
            variant="outlined"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Назад
          </Button>
          <Button
            variant="outlined"
            disabled={!hasNextPage}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Вперёд
          </Button>
        </Stack>
      </Stack>

      {events.length > 0 ? (
        events.map((event) => (
          <EventCard
            key={event.event_id}
            event={event}
            onDelete={handleDeleteEvent}
            onImageClick={(url, alt) => {
              setPreviewImageUrl(url)
              setPreviewImageAlt(alt ?? event.title ?? "Event photo")
            }}
          />
        ))
      ) : (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography color="text.secondary">
              На этой странице событий нет.
            </Typography>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Добавить событие</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={4}
            />
            <Button variant="outlined" component="label">
              Загрузить фото
              <input
                hidden
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              />
            </Button>

            {files.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Выбрано файлов: {files.length}
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleCreateEvent}>
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(previewImageUrl)}
        onClose={() => {
          setPreviewImageUrl(null)
          setPreviewImageAlt("")
        }}
        maxWidth="xl"
        fullWidth
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.72)",
            backdropFilter: "blur(3px)",
          },
        }}
        PaperProps={{
          sx: {
            backgroundColor: "transparent",
            backgroundImage: "none",
            boxShadow: "none",
            overflow: "visible",
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80vh",
            overflow: "hidden",
            backgroundColor: "transparent",
          }}
        >
          {previewImageUrl && (
            <Box
              component="img"
              src={previewImageUrl}
              alt={previewImageAlt}
              sx={{
                width: "100%",
                height: "100%",
                maxWidth: "90vw",
                maxHeight: "80vh",
                objectFit: "contain",
                display: "block",
                borderRadius: 2,
              }}
            />
          )}
        </DialogContent>

        <Button
          variant="contained"
          onClick={() => {
            setPreviewImageUrl(null)
            setPreviewImageAlt("")
          }}
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            minWidth: 44,
            width: 44,
            height: 44,
            borderRadius: "50%",
            zIndex: 1,
          }}
        >
          ×
        </Button>
      </Dialog>

      <Snackbar
        open={Boolean(errorText)}
        autoHideDuration={3000}
        onClose={() => setErrorText("")}
      >
        <Alert severity="error" onClose={() => setErrorText("")}>
          {errorText}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(successText)}
        autoHideDuration={2500}
        onClose={() => setSuccessText("")}
      >
        <Alert severity="success" onClose={() => setSuccessText("")}>
          {successText}
        </Alert>
      </Snackbar>
    </Container>
  )
}