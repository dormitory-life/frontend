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
        overflow: "hidden",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        height: { xs: 420, sm: 240 },
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 6,
        },
      }}
      onClick={() => navigate(`/dormitories/${dorm.id}`)}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "40%" },
          minWidth: { sm: "40%" },
          height: { xs: 220, sm: "100%" },
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {photo ? (
          <Box
            component="img"
            src={photo}
            alt={dorm.name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <Typography color="text.secondary">Нет фото</Typography>
        )}
      </Box>

      <CardContent
        sx={{
          width: { xs: "100%", sm: "60%" },
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          p: 3,
          textAlign: "left",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 1.5,
            fontWeight: 700,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {dorm.name}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mb: 2,
            fontSize: "1rem",
            lineHeight: 1.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {dorm.address}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.7,
            whiteSpace: "pre-line",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: { xs: 4, sm: 5 },
          }}
        >
          {dorm.description}
        </Typography>
      </CardContent>
    </Card>
  )
}