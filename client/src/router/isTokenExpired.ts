export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000 // 초를 밀리초로 변환
    return Date.now() >= exp
  } catch (error) {
    return true // 토큰 파싱에 실패하면 만료된 것으로 간주
  }
}