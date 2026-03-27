import type { Event } from "../types/types"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material"

interface Props {
  event: Event
  onDelete?: (eventId: string) => void
}

export default function EventCard({ event, onDelete }: Props) {
  const photo = event.event_photos?.[0]?.url

  return (
    <Card sx={{ borderRadius: 3, mb: 3 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "320px 1fr" },
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: { xs: 260, md: 240 },
            backgroundColor: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1,
            overflow: "hidden",
          }}
        >
          {photo ? (
            <img
              src={photo}
              alt={event.title}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          ) : (
            <Typography color="text.secondary">Нет фото</Typography>
          )}
        </Box>

        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {event.title}
              </Typography>

              <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                {new Date(event.created_at).toLocaleString()}
              </Typography>

              <Typography>{event.description}</Typography>
            </Box>

            {onDelete && (
              <IconButton color="error" onClick={() => onDelete(event.event_id)}>
                <DeleteOutlineIcon />
              </IconButton>
            )}
          </Stack>
        </CardContent>
      </Box>
    </Card>
  )
}