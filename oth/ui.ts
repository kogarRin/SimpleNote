type Message = {
  message: string,
  type: 'primary' | 'success' | 'warning' | 'info' | 'error',
  duration: number,
  plain: boolean,
}

export const ElmessageConfig = (message: string, type: 'primary' |'success' | 'warning' | 'info' | 'error' = 'info', duration: number , plain: boolean): Message => (
  {
    message,
    type,
    duration,
    plain,
  }
)
