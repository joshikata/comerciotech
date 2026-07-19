export const getApiErrorMessage = (error, fallback) => {
  return error?.response?.data?.message || fallback
}
