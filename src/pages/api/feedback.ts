import axios from 'axios'
import { useForm } from 'react-hook-form'
import { FeedbackState } from '../contact'

export type FormValues = {
  msg: string
  email: string
}

export const sumbitForm = async (
  values: FormValues,
  setFeedbackState: (state: FeedbackState) => void,
  reset: () =>void
) => {
  
  let config = {
    method: 'post',
    url: `${process.env['BACKEND_URL']}/hook/feedback/`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: new URLSearchParams(values),
  }
  try {
    await axios(config)
    setFeedbackState(FeedbackState.SENT)
    reset()
  } catch (error) {
    setFeedbackState(FeedbackState.ERROR)
  }
}
