import type { Review } from "../types/types"
import {
  Box,
  Button,
  Card,
  CardContent,
  ImageList,
  ImageListItem,
  Stack,
  Typography,
} from "@mui/material"

interface Props {
  review: Review
  isMine?: boolean
  onDelete?: (reviewId: string) => void
  onImageClick?: (url: string, alt?: string) => void
}

export default function ReviewCard({
  review,
  isMine,
  onDelete,
  onImageClick,
}: Props) {
  return (
    <Card sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {review.title}
            </Typography>

            <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
              {new Date(review.created_at).toLocaleString()}
            </Typography>

            <Typography sx={{ mb: 2, whiteSpace: "pre-line" }}>
              {review.description}
            </Typography>
          </Box>

          {isMine && onDelete && (
            <Button
              color="error"
              variant="outlined"
              onClick={() => onDelete(review.review_id)}
            >
              Удалить
            </Button>
          )}
        </Stack>

        {review.review_photos?.length > 0 && (
          <ImageList cols={3} gap={12}>
            {review.review_photos.map((photo, index) => (
              <ImageListItem key={photo.path}>
                <Box
                  onClick={() =>
                    onImageClick?.(
                      photo.url,
                      photo.name ?? review.title ?? `Review photo ${index + 1}`
                    )
                  }
                  sx={{
                    width: "100%",
                    height: 220,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 3,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 1,
                    cursor: "zoom-in",
                  }}
                >
                  <img
                    src={photo.url}
                    alt={photo.name ?? `Review photo ${index + 1}`}
                    loading="lazy"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </Box>
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </CardContent>
    </Card>
  )
}