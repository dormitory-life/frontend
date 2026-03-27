import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../api/api"

import type { AvgGrade, Dormitory, Review } from "../types/types"

import ReviewCard from "../components/ReviewCard"
import GradesCard from "../components/GradesCard"
import { getApiErrorText } from "../utils/http"

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Snackbar,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material"

const DORMITORY_FILES_FIELD_NAME = "photos"
const REVIEW_FILES_FIELD_NAME = "photos"

export default function DormitoryPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const currentUserId = localStorage.getItem("userId")

  const [dorm, setDorm] = useState<Dormitory | null>(null)

  const [grades, setGrades] = useState<AvgGrade[]>([])
  const [selectedGradeIndex, setSelectedGradeIndex] = useState(0)

  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsPage, setReviewsPage] = useState(1)
  const [hasNextReviewsPage, setHasNextReviewsPage] = useState(false)

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

  const [errorText, setErrorText] = useState("")
  const [successText, setSuccessText] = useState("")

  const [openSupportDialog, setOpenSupportDialog] = useState(false)
  const [supportTitle, setSupportTitle] = useState("")
  const [supportDescription, setSupportDescription] = useState("")

  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editName, setEditName] = useState("")
  const [editAddress, setEditAddress] = useState("")
  const [editSupportEmail, setEditSupportEmail] = useState("")
  const [editDescription, setEditDescription] = useState("")

  const [openAddReviewDialog, setOpenAddReviewDialog] = useState(false)
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewDescription, setReviewDescription] = useState("")
  const [reviewFiles, setReviewFiles] = useState<File[]>([])

  const [photoFiles, setPhotoFiles] = useState<File[]>([])

  const [openGradeDialog, setOpenGradeDialog] = useState(false)

  const [gradeForm, setGradeForm] = useState({
    bathroom_cleanliness: 3,
    corridor_cleanliness: 3,
    kitchen_cleanliness: 3,
    cleaning_frequency: 3,
    room_spaciousness: 3,
    corridor_spaciousness: 3,
    kitchen_spaciousness: 3,
    shower_location_convenience: 3,
    equipment_maintenance: 3,
    window_condition: 3,
    noise_isolation: 3,
    common_areas_equipment: 3,
    transport_accessibility: 3,
    administration_quality: 3,
    residents_culture_level: 3,
  })

  const setGradeValue = (key: keyof typeof gradeForm, value: number) => {
    setGradeForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleCreateGrade = async () => {
    if (!id) return

    try {
      await api.post(`/core/dormitories/${id}/grades`, gradeForm)

      setOpenGradeDialog(false)
      setSuccessText("оценка отправлена")
      await loadGrades()
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setErrorText("уже оценивали в этом месяце")
      } else {
        setErrorText(getApiErrorText(error))
      }
    }
  }

  const loadDormitory = async () => {
    if (!id) return

    try {
      const res = await api.get(`/core/dormitories/${id}`)
      const dormitory = res.data.dormitory
      setDorm(dormitory)
      setSelectedPhotoIndex(0)

      setEditName(dormitory.name ?? "")
      setEditAddress(dormitory.address ?? "")
      setEditSupportEmail(dormitory.support_email ?? "")
      setEditDescription(dormitory.description ?? "")
    } catch (error) {
      setErrorText(getApiErrorText(error))
    }
  }

  const loadGrades = async () => {
    if (!id) return

    try {
      const res = await api.get(`/core/dormitories/${id}/grades`)
      setGrades(res.data.avg_grades ?? [])
      setSelectedGradeIndex(0)
    } catch (error) {
      setErrorText(getApiErrorText(error))
    }
  }

  const loadReviews = async (targetPage: number) => {
    if (!id) return

    try {
      const currentRes = await api.get(
        `/core/dormitories/${id}/reviews?page=${targetPage}`
      )
      const currentReviews: Review[] = currentRes.data.reviews ?? []
      setReviews(currentReviews)

      const nextRes = await api.get(
        `/core/dormitories/${id}/reviews?page=${targetPage + 1}`
      )
      const nextReviews: Review[] = nextRes.data.reviews ?? []
      setHasNextReviewsPage(nextReviews.length > 0)
    } catch (error) {
      setErrorText(getApiErrorText(error))
    }
  }

  useEffect(() => {
    void loadDormitory()
    void loadGrades()
  }, [id])

  useEffect(() => {
    void loadReviews(reviewsPage)
  }, [id, reviewsPage])

  const selectedGrade = grades[selectedGradeIndex] ?? null
  const photos = dorm?.photo_links ?? []
  const currentPhoto = photos[selectedPhotoIndex]?.url ?? ""

  const canGoPrevPhoto = selectedPhotoIndex > 0
  const canGoNextPhoto = selectedPhotoIndex < photos.length - 1

  const handleCreateSupport = async () => {
    try {
      await api.post("/core/dormitories/support", {
        title: supportTitle,
        description: supportDescription,
      })

      setOpenSupportDialog(false)
      setSupportTitle("")
      setSupportDescription("")
      setSuccessText("обращение отправлено")
    } catch (error) {
      setErrorText(getApiErrorText(error))
    }
  }

  const handleUpdateDormitory = async () => {
    if (!id) return

    try {
      await api.put(`/core/dormitories/${id}`, {
        name: editName,
        address: editAddress,
        support_email: editSupportEmail,
        description: editDescription,
      })

      setOpenEditDialog(false)
      setSuccessText("общежитие обновлено")
      await loadDormitory()
    } catch (error) {
      setErrorText(getApiErrorText(error))
    }
  }

  const handleAddDormitoryPhotos = async () => {
    if (!id || photoFiles.length === 0) return

    try {
      const formData = new FormData()
      photoFiles.forEach((file) => {
        formData.append(DORMITORY_FILES_FIELD_NAME, file)
      })

      await api.post(`/core/dormitories/${id}/photos`, formData)
      setPhotoFiles([])
      setSuccessText("фотографии добавлены")
      await loadDormitory()
    } catch (error) {
      setErrorText(getApiErrorText(error))
    }
  }

  const handleDeleteDormitoryPhotos = async () => {
    if (!id) return

    try {
      await api.delete(`/core/dormitories/${id}/photos`)
      setSuccessText("фотографии удалены")
      await loadDormitory()
    } catch (error) {
      setErrorText(getApiErrorText(error))
    }
  }

  const handleCreateReview = async () => {
    if (!id) return

    try {
      const formData = new FormData()
      formData.append("title", reviewTitle)
      formData.append("description", reviewDescription)

      reviewFiles.forEach((file) => {
        formData.append(REVIEW_FILES_FIELD_NAME, file)
      })

      await api.post(`/core/dormitories/${id}/reviews`, formData)

      setOpenAddReviewDialog(false)
      setReviewTitle("")
      setReviewDescription("")
      setReviewFiles([])
      setSuccessText("отзыв добавлен")
      await loadReviews(1)
      setReviewsPage(1)
    } catch (error) {
      setErrorText(getApiErrorText(error))
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!id) return

    try {
      await api.delete(`/core/dormitories/${id}/reviews/${reviewId}`)
      setSuccessText("отзыв удалён")
      await loadReviews(reviewsPage)
    } catch (error) {
      setErrorText(getApiErrorText(error))
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Card sx={{ borderRadius: 4, overflow: "hidden" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.6fr 1fr" },
              alignItems: "stretch",
              minHeight: { xs: "auto", md: 560 },
            }}
          >
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 320, md: 520 },
                  borderRadius: 3,
                  backgroundColor: "#eeeeee",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
                  boxSizing: "border-box",
                }}
              >
                {currentPhoto ? (
                  <img
                    src={currentPhoto}
                    alt={dorm?.name ?? "Dormitory photo"}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                ) : (
                  <Typography color="text.secondary">Нет фотографии</Typography>
                )}
              </Box>

              {photos.length > 1 && (
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      disabled={!canGoPrevPhoto}
                      onClick={() =>
                        setSelectedPhotoIndex((prev) => Math.max(0, prev - 1))
                      }
                    >
                      Предыдущее фото
                    </Button>

                    <Button
                      variant="outlined"
                      disabled={!canGoNextPhoto}
                      onClick={() =>
                        setSelectedPhotoIndex((prev) =>
                          Math.min(photos.length - 1, prev + 1)
                        )
                      }
                    >
                      Следующее фото
                    </Button>

                    <Chip
                      label={`${selectedPhotoIndex + 1} / ${photos.length}`}
                    />
                  </Stack>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      overflowX: "auto",
                      pb: 1,
                    }}
                  >
                    {photos.map((photo, index) => (
                      <Box
                        key={photo.path}
                        onClick={() => setSelectedPhotoIndex(index)}
                        sx={{
                          width: 96,
                          height: 72,
                          flex: "0 0 auto",
                          borderRadius: 2,
                          overflow: "hidden",
                          border:
                            selectedPhotoIndex === index
                              ? "2px solid #1976d2"
                              : "1px solid #ddd",
                          backgroundColor: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          p: 0.5,
                        }}
                      >
                        <img
                          src={photo.url}
                          alt={photo.name}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Stack>
              )}

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button variant="outlined" component="label">
                  Добавить фотографии
                  <input
                    hidden
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setPhotoFiles(Array.from(e.target.files ?? []))
                    }
                  />
                </Button>

                <Button
                  variant="contained"
                  onClick={handleAddDormitoryPhotos}
                  disabled={photoFiles.length === 0}
                >
                  Загрузить выбранные
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDeleteDormitoryPhotos}
                >
                  Удалить фотографии
                </Button>
              </Stack>

              {photoFiles.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  Выбрано файлов: {photoFiles.length}
                </Typography>
              )}
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={2}
                >
                  <Box>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {dorm?.name ?? "Общежитие"}
                    </Typography>
                    <Typography color="text.secondary">
                      {dorm?.address ?? "Адрес не указан"}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => setOpenSupportDialog(true)}
                  >
                    Поддержка
                  </Button>
                </Stack>

                <Divider />

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Описание
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    {dorm?.description || "Описание отсутствует"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Почта поддержки
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    {dorm?.support_email || "Не указана"}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label={`ID: ${dorm?.id ?? "-"}`} />
                  <Chip
                    variant="outlined"
                    label={`Фото: ${dorm?.photo_links?.length ?? 0}`}
                  />
                </Stack>

                <Stack direction="row" spacing={2} sx={{ pt: 1 }} flexWrap="wrap">
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/dormitories/${id}/feed`)}
                  >
                    Лента
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/dormitories/${id}/chat`)}
                  >
                    Чат
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => setOpenEditDialog(true)}
                  >
                    Изменить
                  </Button>
                </Stack>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setOpenGradeDialog(true)}
                  sx={{
                    alignSelf: "flex-start",
                    minWidth: 220,
                  }}
                >
                  Оценить общежитие
                </Button>
              </Stack>
            </CardContent>
          </Box>
        </Card>

        <Box>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Typography variant="h5">Оценки по периодам</Typography>

            {grades.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button
                  variant="outlined"
                  disabled={selectedGradeIndex <= 0}
                  onClick={() =>
                    setSelectedGradeIndex((prev) => Math.max(0, prev - 1))
                  }
                >
                  Назад
                </Button>
                <Button
                  variant="outlined"
                  disabled={selectedGradeIndex >= grades.length - 1}
                  onClick={() =>
                    setSelectedGradeIndex((prev) =>
                      Math.min(grades.length - 1, prev + 1)
                    )
                  }
                >
                  Вперёд
                </Button>
              </Stack>
            )}
          </Stack>

          {selectedGrade ? (
            <GradesCard grade={selectedGrade} />
          ) : (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography color="text.secondary">
                  Пока нет средних оценок для этого общежития.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>

        <Box>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Typography variant="h5">Отзывы</Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button
                variant="contained"
                onClick={() => setOpenAddReviewDialog(true)}
              >
                Добавить отзыв
              </Button>

              <Button
                variant="outlined"
                disabled={reviewsPage <= 1}
                onClick={() => setReviewsPage((prev) => Math.max(1, prev - 1))}
              >
                Назад
              </Button>

              <Chip label={`Страница ${reviewsPage}`} />

              <Button
                variant="outlined"
                disabled={!hasNextReviewsPage}
                onClick={() => setReviewsPage((prev) => prev + 1)}
              >
                Вперёд
              </Button>
            </Stack>
          </Stack>

          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard
                key={review.review_id}
                review={review}
                isMine={review.owner_id === currentUserId}
                onDelete={handleDeleteReview}
              />
            ))
          ) : (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography color="text.secondary">
                  На этой странице отзывов нет.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Stack>

      <Dialog
        open={openSupportDialog}
        onClose={() => setOpenSupportDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Обращение в поддержку</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Заголовок"
              value={supportTitle}
              onChange={(e) => setSupportTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Описание"
              value={supportDescription}
              onChange={(e) => setSupportDescription(e.target.value)}
              fullWidth
              multiline
              minRows={4}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSupportDialog(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleCreateSupport}>
            Отправить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Изменить общежитие</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Название"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Адрес"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              fullWidth
            />
            <TextField
              label="Почта поддержки"
              value={editSupportEmail}
              onChange={(e) => setEditSupportEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="Описание"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              fullWidth
              multiline
              minRows={4}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleUpdateDormitory}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAddReviewDialog}
        onClose={() => setOpenAddReviewDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Добавить отзыв</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Заголовок"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Описание"
              value={reviewDescription}
              onChange={(e) => setReviewDescription(e.target.value)}
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
                onChange={(e) =>
                  setReviewFiles(Array.from(e.target.files ?? []))
                }
              />
            </Button>

            {reviewFiles.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                Выбрано файлов: {reviewFiles.length}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddReviewDialog(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleCreateReview}>
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openGradeDialog}
        onClose={() => setOpenGradeDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Оценить общежитие</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {[
              ["bathroom_cleanliness", "Чистота санузлов"],
              ["corridor_cleanliness", "Чистота коридоров"],
              ["kitchen_cleanliness", "Чистота кухни"],
              ["cleaning_frequency", "Регулярность уборки"],
              ["room_spaciousness", "Просторность комнат"],
              ["corridor_spaciousness", "Просторность коридоров"],
              ["kitchen_spaciousness", "Просторность кухни"],
              ["shower_location_convenience", "Удобство расположения душа"],
              ["equipment_maintenance", "Состояние бытового оборудования"],
              ["window_condition", "Состояние окон"],
              ["noise_isolation", "Шумоизоляция"],
              ["common_areas_equipment", "Оснащение общих зон"],
              ["transport_accessibility", "Транспортная доступность"],
              ["administration_quality", "Качество работы администрации"],
              ["residents_culture_level", "Общая атмосфера"],
            ].map(([key, label]) => {
              const typedKey = key as keyof typeof gradeForm

              return (
                <Box key={key}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Typography>{label}</Typography>
                    <Chip label={gradeForm[typedKey]} />
                  </Stack>

                  <Slider
                    value={gradeForm[typedKey]}
                    min={1}
                    max={5}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                    onChange={(_, value) =>
                      setGradeValue(typedKey, Array.isArray(value) ? value[0] : value)
                    }
                  />
                </Box>
              )
            })}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGradeDialog(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleCreateGrade}>
            Отправить
          </Button>
        </DialogActions>
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