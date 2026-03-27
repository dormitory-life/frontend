import type { Dormitory } from "../types/types"
import { useNavigate } from "react-router-dom"
import { Box, Card, CardContent, Typography } from "@mui/material"

interface Props {
  dorm: Dormitory
}

export default function DormitoryCard({ dorm }: Props) {
  const navigate = useNavigate()
  const photo = dorm.photo_links?.[0]?.url

  return (
    <Card
      sx={{
        cursor: "pointer",
        borderRadius: 4,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={() => navigate(`/dormitories/${dorm.id}`)}
    >
      <Box
        sx={{
          width: "100%",
          height: 240,
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          overflow: "hidden",
        }}
      >
        {photo ? (
          <img
            src={photo}
            alt={dorm.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : (
          <Typography color="text.secondary">Нет фото</Typography>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {dorm.name}
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 1 }}>
          {dorm.address}
        </Typography>

        <Typography variant="body2">{dorm.description}</Typography>
      </CardContent>
    </Card>
  )
}